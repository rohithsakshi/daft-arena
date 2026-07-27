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
  // Need to replace 'ADMIN' or "ADMIN" exactly, avoiding SUPERADMIN or ADMIN_ROLES
  // We can use a regex that matches exactly the word ADMIN inside quotes.
  let newContent = content.replace(/(['"`])ADMIN(['"`])/g, '$1TOURNAMENT_ADMIN$2');
  
  if(content !== newContent) {
    fs.writeFileSync(f, newContent);
    console.log('Updated: ' + f);
    total++;
  }
});
console.log('Total files updated: ' + total);
