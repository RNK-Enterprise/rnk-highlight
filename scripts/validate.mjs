import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const modulePath = path.join(root, 'module.json');
const packagePath = path.join(root, 'package.json');
const textFilePatterns = [
  'README.md',
  'CHANGELOG.md',
  'module.json',
  'package.json',
  'src/main.js',
  'src/settings.js',
  'styles/main.css',
  'templates/settings.hbs',
  'languages/en.json'
];
const lineCappedFiles = [
  'src/main.js',
  'src/settings.js',
  'styles/main.css',
  'templates/settings.hbs'
];
const blockedPatterns = [
  new RegExp(codepointsToText([97, 114, 116, 105, 102, 105, 99, 105, 97, 108, 32, 105, 110, 116, 101, 108, 108, 105, 103, 101, 110, 99, 101]), 'iu'),
  new RegExp(codepointsToText([109, 97, 99, 104, 105, 110, 101, 32, 108, 101, 97, 114, 110, 105, 110, 103]), 'iu'),
  new RegExp(codepointsToText([99, 111, 112, 105, 108, 111, 116]), 'iu'),
  new RegExp(codepointsToText([97, 115, 115, 105, 115, 116, 97, 110, 116]), 'iu'),
  new RegExp(codepointsToText([103, 112, 116]), 'iu')
];
const emojiPattern = /[\u{1F300}-\u{1FAFF}]/gu;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function codepointsToText(codepoints) {
  return String.fromCharCode(...codepoints);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`Invalid JSON in ${path.basename(filePath)}: ${error.message}`);
  }
}

function ensureFileExists(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`Missing required file: ${relativePath}`);
  }
}

function checkLineCap(relativePath) {
  const absolutePath = path.join(root, relativePath);
  const lineCount = fs.readFileSync(absolutePath, 'utf8').split(/\r?\n/).length;
  if (lineCount > 500) {
    fail(`${relativePath} exceeds the 500 line limit with ${lineCount} lines.`);
  }
}

function scanText(relativePath) {
  const absolutePath = path.join(root, relativePath);
  const contents = fs.readFileSync(absolutePath, 'utf8');

  for (const pattern of blockedPatterns) {
    if (pattern.test(contents)) {
      fail(`Blocked text found in ${relativePath}.`);
    }
  }

  if (emojiPattern.test(contents)) {
    fail(`Pictographic character found in ${relativePath}.`);
  }
}

const moduleJson = readJson(modulePath);
const packageJson = readJson(packagePath);

for (const file of [...textFilePatterns, 'LICENSE-RNK-PROPRIETARY.md']) {
  ensureFileExists(file);
}

for (const file of lineCappedFiles) {
  checkLineCap(file);
}

for (const file of textFilePatterns) {
  scanText(file);
}

if (moduleJson.version !== packageJson.version) {
  fail(`Version mismatch: module.json=${moduleJson.version}, package.json=${packageJson.version}`);
}

if (moduleJson.title !== 'RNK™ Highlight') {
  fail(`module.json title must be RNK™ Highlight. Found: ${moduleJson.title}`);
}

if (moduleJson.protected !== false) {
  fail('module.json protected must be false for this free module.');
}

if (moduleJson.manifest !== 'https://github.com/RNK-Enterprise/rnk-highlight/releases/latest/download/module.json') {
  fail('module.json manifest must point to the latest GitHub release asset.');
}

if (moduleJson.download !== 'https://github.com/RNK-Enterprise/rnk-highlight/releases/latest/download/module.zip') {
  fail('module.json download must point to the latest GitHub release asset.');
}

console.log('Validation passed.');
