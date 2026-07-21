const fs = require('fs');
const path = require('path');

const mappings = [
  { file: 'api/venues/[venueId]/route.ts', param: 'venueId' },
  { file: 'api/venues/[venueId]/playing-areas/route.ts', param: 'venueId' },
  { file: 'api/tournaments/[tournamentId]/status/route.ts', param: 'tournamentId' },
  { file: 'api/tournaments/[tournamentId]/route.ts', param: 'tournamentId' },
  { file: 'api/tournaments/[tournamentId]/events/route.ts', param: 'tournamentId' },
  { file: 'api/sports/[sportId]/rule-packages/[rulePackageId]/route.ts', param: 'rulePackageId', extra: 'sportId' },
  { file: 'api/sports/[sportId]/rule-packages/[rulePackageId]/publish/route.ts', param: 'rulePackageId', extra: 'sportId' },
  { file: 'api/registrations/[registrationId]/route.ts', param: 'registrationId' },
  { file: 'api/playing-areas/[playingAreaId]/route.ts', param: 'playingAreaId' },
  { file: 'api/events/[eventId]/route.ts', param: 'eventId' },
  { file: 'api/events/[eventId]/registrations/route.ts', param: 'eventId' },
];

const basePath = path.join(__dirname, 'apps/web/src/app');

for (const map of mappings) {
  const filePath = path.join(basePath, map.file);
  if (!fs.existsSync(filePath)) {
    console.log('Skipping', filePath);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace `{ id: string }` with `{ param: string }`
  // and for rulePackages, `{ sportId: string, id: string }` -> `{ sportId: string, rulePackageId: string }` etc.
  
  if (map.extra) {
    content = content.replace(/{ params }: { params: Promise<{ sportId: string, id: string }> }/g, `{ params }: { params: Promise<{ sportId: string, ${map.param}: string }> }`);
    content = content.replace(/{ params }: { params: Promise<{ id: string }> }/g, `{ params }: { params: Promise<{ sportId: string, ${map.param}: string }> }`);
  } else {
    content = content.replace(/{ params }: { params: Promise<{ id: string }> }/g, `{ params }: { params: Promise<{ ${map.param}: string }> }`);
  }
  
  content = content.replace(/const { id } = await params;/g, `const { ${map.param} } = await params;`);
  content = content.replace(/const { sportId, id } = await params;/g, `const { sportId, ${map.param} } = await params;`);
  
  // Replace all other instances of `id` as variable
  content = content.replace(/\(id/g, `(${map.param}`);
  content = content.replace(/ id,/g, ` ${map.param},`);
  content = content.replace(/ id\)/g, ` ${map.param})`);
  
  fs.writeFileSync(filePath, content);
  console.log('Updated', filePath);
}
