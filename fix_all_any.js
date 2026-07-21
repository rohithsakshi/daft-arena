const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'apps/web/src'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;
  
  content = content.replace(/: any\b/g, ': unknown');
  content = content.replace(/as any\b/g, 'as unknown');
  content = content.replace(/<any>/g, '<unknown>');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed any in', file);
  }
}
