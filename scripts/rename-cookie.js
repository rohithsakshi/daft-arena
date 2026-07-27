const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.match(/\.(ts|tsx|js|jsx)$/)) results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(process.cwd(), 'apps/web/src'));
let total = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  let newContent = content
    .replace(/\.cookies\.get\('token'\)/g, `.cookies.get('daft_token')`)
    .replace(/\.cookies\.delete\('token'\)/g, `.cookies.delete('daft_token')`)
    .replace(/name:\s*'token'/g, `name: 'daft_token'`)
    .replace(/cookies\['accessToken'\]/g, `cookies['daft_token']`);
  
  if(content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Updated: ' + f);
    total++;
  }
});
console.log('Total files updated: ' + total);
