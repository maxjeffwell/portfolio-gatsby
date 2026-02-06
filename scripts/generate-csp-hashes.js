const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cheerio = require('cheerio');

function generateHash(content, algorithm = 'sha256') {
  const hash = crypto.createHash(algorithm);
  hash.update(content, 'utf8');
  return `'${algorithm}-${hash.digest('base64')}'`;
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
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: *.google-analytics.com *.googletagmanager.com *.hotjar.com *.clarity.ms *.facebook.com *.linkedin.com",
    "worker-src 'self' blob:",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com data:",
    "img-src 'self' data: blob: *.google-analytics.com *.googletagmanager.com *.hotjar.com *.clarity.ms *.facebook.com *.linkedin.com",
    "connect-src 'self' https://showcase.el-jefe.me *.google-analytics.com *.analytics.google.com *.googletagmanager.com *.hotjar.com *.clarity.ms *.facebook.com *.linkedin.com *.posthog.com plausible.io",
    "manifest-src 'self'",
    "frame-src *.hotjar.com *.clarity.ms 'self'",
    "object-src 'none'",
    "frame-ancestors 'self' https://iframetester.com https://webofdevs.com https://showcase.el-jefe.me",
    "base-uri 'self'",
    "form-action 'self' https://el-jefe.me",
    'upgrade-insecure-requests',
  ].join('; ');

  // eslint-disable-next-line no-console
  console.log('Generated CSP:');
  // eslint-disable-next-line no-console
  console.log(csp);

  // Update _headers file
  const headersPath = path.join(publicDir, '_headers');
  let headersContent = fs.readFileSync(headersPath, 'utf8');

  // Remove ALL existing CSP-related content (headers and comments)
  // This regex removes both the CSP headers and the "Hash-based Content Security Policy" comments
  headersContent = headersContent.replace(/# Hash-based Content Security Policy\n\/\*\n(\s*Content-Security-Policy:.*?\n)?/g, '');

  // Also remove any standalone CSP lines
  headersContent = headersContent.replace(/\s*Content-Security-Policy:.*?\n/g, '');

  // Ensure file ends properly before adding new content
  headersContent = headersContent.trim();

  // Add CSP at the end of the file (only once)
  headersContent += `\n\n# Hash-based Content Security Policy\n/*\n  Content-Security-Policy: ${csp}\n`;

  // Storybook Composition: override X-Frame-Options and add CORS for /storybook/*
  // Must come AFTER the /* rules so Netlify uses these values for /storybook/ paths
  headersContent += `\n# Storybook Composition headers (must be after /* rules)\n/storybook/*\n  Access-Control-Allow-Origin: https://showcase.el-jefe.me\n  X-Frame-Options: SAMEORIGIN\n`;

  fs.writeFileSync(headersPath, headersContent);
  // eslint-disable-next-line no-console
  console.log('Updated _headers file with hash-based CSP');
}

// Only run if called directly
if (require.main === module) {
  generateCSPForFiles();
}

module.exports = { generateCSPForFiles };
