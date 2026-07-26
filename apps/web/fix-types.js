const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    for (const [search, replace] of replacements) {
        if (content.includes(search)) {
            content = content.replaceAll(search, replace);
            changed = true;
        }
    }
    if (changed) {
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
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            replaceInFile(fullPath, [
                ['error as unknown', 'error as any'],
                ['body as unknown', 'body as any'],
                ['data as unknown', 'data as any'],
                ['const role = m.roleId as unknown;', 'const role = m.roleId as any;'],
                ['user: unknown', 'user: any'],
                ['...args: unknown[]', '...args: any[]'],
                ['mockPermissionResolver: unknown', 'mockPermissionResolver: any'],
                ['mockRoleRepo: unknown', 'mockRoleRepo: any'],
                ['useState<unknown>', 'useState<any>']
            ]);
        }
    }
}

processDir(path.join(__dirname, 'src'));
