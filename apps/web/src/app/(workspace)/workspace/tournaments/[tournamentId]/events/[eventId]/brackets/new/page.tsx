import CreateBracketClient from './CreateBracketClient';

export default function CreateBracketPage({ params }: { params: { tournamentId: string, eventId: string } }) {
  return (
    <div className="container mx-auto py-8">
      <CreateBracketClient tournamentId={params.tournamentId} eventId={params.eventId} />
    </div>
  );
}
