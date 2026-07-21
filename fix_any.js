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
  let newContent = content.replace(/catch \((?:error|e): any\)/g, 'catch (error: unknown)');
  
  // also replace (error: any) => with (error: unknown) => in generic error callbacks
  newContent = newContent.replace(/\(error: any\) =>/g, '(error: unknown) =>');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log('Fixed any in', file);
  }
}
