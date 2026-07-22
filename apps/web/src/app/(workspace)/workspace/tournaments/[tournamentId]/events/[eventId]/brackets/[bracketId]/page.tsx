import { getQueryClient } from '@/lib/query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import BracketViewerClient from './BracketViewerClient';

export default async function BracketViewerPage({ params }: { params: { bracketId: string } }) {
  const queryClient = getQueryClient();
  
  // Prefetch data for the client
  // await queryClient.prefetchQuery({
  //   queryKey: ['bracket', params.bracketId],
  //   queryFn: () => fetchBracket(params.bracketId)
  // });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col h-full space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Bracket Viewer</h1>
        <div className="flex-1 w-full bg-card rounded-xl border shadow-sm p-4 overflow-hidden relative">
           <BracketViewerClient bracketId={params.bracketId} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
