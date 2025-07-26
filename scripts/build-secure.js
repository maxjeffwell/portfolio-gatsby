#!/usr/bin/env node

/**
 * Secure build script - removes identifying information from built files
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const PUBLIC_DIR = path.join(__dirname, '../public');

async function removeLibrarySignatures() {
  // eslint-disable-next-line no-console
  console.log('🔒 Removing library signatures from built files...');

  // Find all JavaScript files
  const jsFiles = await glob(`${PUBLIC_DIR}/**/*.js`);

  for (const file of jsFiles) {
    let content = fs.readFileSync(file, 'utf8');

    // Remove common library signatures and comments
    content = content.replace(/\/\*\s*!?\s*react\s*\*\//gi, '');
    content = content.replace(/\/\*\s*!?\s*@mui\/material\s*\*\//gi, '');
    content = content.replace(/\/\*\s*!?\s*emotion\s*\*\//gi, '');
    content = content.replace(/\/\*\s*!?\s*webpack\s*\*\//gi, '');
    content = content.replace(/\/\*\s*!?\s*gatsby\s*\*\//gi, '');

    // Remove version comments
    content = content.replace(/\/\*\s*!?\s*v?\d+\.\d+\.\d+.*?\*\//gi, '');

    // Remove source map references (additional security)
    content = content.replace(/\/\/# sourceMappingURL=.*/g, '');
    content = content.replace(/\/\*# sourceMappingURL=.*?\*\//g, '');

    // Remove webpack chunk names that reveal structure
    content = content.replace(/webpackChunkName:\s*["'][^"']*["']/g, 'webpackChunkName:"c"');

    fs.writeFileSync(file, content);
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Processed ${jsFiles.length} JavaScript files`);
}

async function removeSourceMaps() {
  // eslint-disable-next-line no-console
  console.log('🗑️  Removing source map files...');

  const sourceMapFiles = await glob(`${PUBLIC_DIR}/**/*.map`);

  for (const file of sourceMapFiles) {
    fs.unlinkSync(file);
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Removed ${sourceMapFiles.length} source map files`);
}

// eslint-disable-next-line no-unused-vars
async function obfuscateFilenames() {
  // eslint-disable-next-line no-console
  console.log('🎭 Obfuscating revealing filenames...');

  // This would rename files with obvious library names
  // Be careful - this can break the site if not done properly
  const files = await glob(`${PUBLIC_DIR}/**/react-*.js`);

  for (const file of files) {
    // const dir = path.dirname(file);
    const ext = path.extname(file);
    const newName = `lib-${Math.random().toString(36).substr(2, 8)}${ext}`;
    // const newPath = path.join(dir, newName);

    // Would need to update references in HTML files too
    // eslint-disable-next-line no-console
    console.log(`Would rename: ${path.basename(file)} -> ${newName}`);
  }
}

async function main() {
  try {
    await removeLibrarySignatures();
    await removeSourceMaps();
    // await obfuscateFilenames(); // Commented out - requires careful implementation

    // eslint-disable-next-line no-console
    console.log('🔐 Secure build completed!');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error during secure build:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { removeLibrarySignatures, removeSourceMaps };
