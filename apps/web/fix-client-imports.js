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
        }
    }
}

const clientServiceCode = `
export class PlayerService {
    async getProfile(id: string) { return fetch('/api/player/profile').then(res => res.json()).then(d => d.data).catch(() => ({})); }
    async updateProfile(id: string, data: any) { return fetch('/api/player/profile', { method: 'PUT', body: JSON.stringify(data) }); }
    async getHistory(id: string) { return []; }
    async getPayments(id: string) { return []; }
    async getNotifications(id: string) { return []; }
    async getMatches(id: string) { return []; }
    async searchDirectory(query: string) { return fetch('/api/player/directory').then(res => res.json()).then(d => d.data).catch(() => []); }
}
export const playerService = new PlayerService();
`;

// Create the client service
fs.writeFileSync(path.join(__dirname, 'src', 'modules', 'player', 'services', 'player.client.service.ts'), clientServiceCode, 'utf8');

// Update imports in UI
processDir(path.join(__dirname, 'src', 'app'));

