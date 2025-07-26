const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cheerio = require('cheerio');

function generateHash(content, algorithm = 'sha256') {
  return `'${algorithm}-${crypto.createHash(algorithm).update(content, 'utf8').digest('base64')}'`;
}

function extractInlineScriptsAndStyles(htmlContent) {
  const $ = cheerio.load(htmlContent);
  const scriptHashes = [];
  const styleHashes = [];

  // Extract inline scripts
  $('script:not([src])').each((i, elem) => {
    const content = $(elem).html();
    if (content && content.trim()) {
      scriptHashes.push(generateHash(content.trim()));
    }
  });

  // Extract inline styles
  $('style').each((i, elem) => {
    const content = $(elem).html();
    if (content && content.trim()) {
      styleHashes.push(generateHash(content.trim()));
    }
  });

  return { scriptHashes, styleHashes };
}

function generateCSPForFiles() {
  const publicDir = path.join(__dirname, '..', 'public');
  const htmlFiles = [];

  // Find all HTML files
  function findHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        findHtmlFiles(filePath);
      } else if (file.endsWith('.html')) {
        htmlFiles.push(filePath);
      }
    });
  }

  findHtmlFiles(publicDir);

  const allScriptHashes = new Set();
  const allStyleHashes = new Set();

  // Process each HTML file
  htmlFiles.forEach((filePath) => {
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    const { scriptHashes, styleHashes } = extractInlineScriptsAndStyles(htmlContent);

    scriptHashes.forEach((hash) => allScriptHashes.add(hash));
    styleHashes.forEach((hash) => allStyleHashes.add(hash));
  });

  // Generate CSP with simpler rules to avoid header length issues
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google-analytics.com *.googletagmanager.com *.hotjar.com *.clarity.ms *.facebook.com *.linkedin.com",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com data:",
    "img-src 'self' data: blob: *.google-analytics.com *.googletagmanager.com *.hotjar.com *.clarity.ms *.facebook.com *.linkedin.com",
    "connect-src 'self' *.google-analytics.com *.analytics.google.com *.googletagmanager.com *.hotjar.com *.clarity.ms *.facebook.com *.linkedin.com *.posthog.com plausible.io",
    "manifest-src 'self'",
    "frame-src *.hotjar.com *.clarity.ms 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self' https://el-jefe.me",
    'upgrade-insecure-requests',
  ].join('; ');

  console.log('Generated CSP:');
  console.log(csp);

  // Update _headers file
  const headersPath = path.join(publicDir, '_headers');
  let headersContent = fs.readFileSync(headersPath, 'utf8');

  // Remove any existing CSP line first
  headersContent = headersContent.replace(/\s*Content-Security-Policy:.*?\n/g, '');

  // Find the security headers section and add CSP
  if (headersContent.includes('Permissions-Policy:')) {
    headersContent = headersContent.replace(
      /(Permissions-Policy:.*\n)/,
      `$1  Content-Security-Policy: ${csp}\n`
    );
  } else {
    // Add CSP at the end of the file
    headersContent += `\n# Hash-based Content Security Policy\n/*\n  Content-Security-Policy: ${csp}\n`;
  }

  fs.writeFileSync(headersPath, headersContent);
  console.log('Updated _headers file with hash-based CSP');
}

// Only run if called directly
if (require.main === module) {
  generateCSPForFiles();
}

module.exports = { generateCSPForFiles };
