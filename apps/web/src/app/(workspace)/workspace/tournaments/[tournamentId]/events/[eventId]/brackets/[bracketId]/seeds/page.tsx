import SeedManagerClient from './SeedManagerClient';

export default function SeedManagerPage({ params }: { params: { bracketId: string } }) {
  return (
    <div className="container mx-auto py-8">
      <SeedManagerClient bracketId={params.bracketId} />
    </div>
  );
}
