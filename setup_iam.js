const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'apps', 'web', 'src');
const iamDir = path.join(srcDir, 'modules', 'iam');

const dirs = [
  'dtos',
  'repositories',
  'services',
  'guards',
  'api',
  'types',
  'schemas',
  'seed',
  '__tests__'
].map(d => path.join(iamDir, d));

dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

console.log("IAM directories created.");
