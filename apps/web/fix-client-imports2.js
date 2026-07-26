const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, searchRegex, replaceStr) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    if (searchRegex.test(content)) {
        content = content.replace(searchRegex, replaceStr);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed', filePath);
    }
}

function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(
                fullPath,
                /from\s+['"]@\/modules\/player\/services\/player\.service['"]/g,
                "from '@/modules/player/services/player.client.service'"
            );
            // also handle relative imports if any
            replaceInFile(
                fullPath,
                /from\s+['"]\.\.\/services\/player\.service['"]/g,
                "from '../services/player.client.service'"
            );
        }
    }
}

processDir(path.join(__dirname, 'src', 'modules'));

console.log('Fixed client imports in modules');
