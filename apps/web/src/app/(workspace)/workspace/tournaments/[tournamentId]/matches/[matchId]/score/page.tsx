'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { MatchStatus } from '@/modules/core/enums';

export default function MobileRefereePage() {
  const params = useParams();
  const tournamentId = params?.tournamentId as string;
  const matchId = params?.matchId as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: res, isLoading } = useQuery({
    queryKey: ['match', matchId],
    queryFn: async () => {
      const response = await fetch(`/api/tournaments/${tournamentId}/matches/${matchId}/score`);
      if (!response.ok) throw new Error('Failed to fetch match');
      return response.json();
    }
  });

  const match = res?.data;
  
  // Local state for fast updates before syncing
  const [p1Scores, setP1Scores] = React.useState<number[]>([0]);
  const [p2Scores, setP2Scores] = React.useState<number[]>([0]);
  const [currentGame, setCurrentGame] = React.useState(0);

  // Initialize state from DB when loaded
  React.useEffect(() => {
    if (match && match.scores) {
      if (match.scores.p1.length > 0) setP1Scores(match.scores.p1);
      if (match.scores.p2.length > 0) setP2Scores(match.scores.p2);
      setCurrentGame(Math.max(match.scores.p1.length - 1, 0));
    }
  }, [match]);

  const updateScoreMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch(`/api/tournaments/${tournamentId}/matches/${matchId}/score`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update score');
      return res.json();
    }
  });

  if (isLoading || !match) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-violet-500 animate-spin mb-4" />
        <p className="text-muted-foreground">Loading match data...</p>
      </div>
    );
  }

  const getPlayerName = (participantInfo: any) => {
    if (!participantInfo || participantInfo.length === 0) return 'TBD';
    return participantInfo.map((p: any) => p.name).join(' & ');
  };

  const p1Name = getPlayerName(match.participant1Id?.participantIds);
  const p2Name = getPlayerName(match.participant2Id?.participantIds);

  const saveToDb = (newP1Scores: number[], newP2Scores: number[], newStatus = match.status, winnerId = null) => {
    updateScoreMutation.mutate({
      scores: { p1: newP1Scores, p2: newP2Scores },
      status: newStatus,
      winnerId
    });
  };

  const checkGameWinner = (s1: number, s2: number) => {
    if (s1 >= 21 && s1 - s2 >= 2) return 1;
    if (s2 >= 21 && s2 - s1 >= 2) return 2;
    if (s1 === 30) return 1;
    if (s2 === 30) return 2;
    return 0;
  };

  const handlePoint = (player: 1 | 2) => {
    if (match.status === MatchStatus.Completed) return;

    const newP1 = [...p1Scores];
    const newP2 = [...p2Scores];

    if (player === 1) newP1[currentGame] += 1;
    else newP2[currentGame] += 1;

    setP1Scores(newP1);
    setP2Scores(newP2);

    const winner = checkGameWinner(newP1[currentGame], newP2[currentGame]);
    
    if (winner !== 0) {
      toast.success(`Game ${currentGame + 1} won by ${winner === 1 ? p1Name : p2Name}!`);
      
      // Check match winner (best of 3)
      let p1Games = 0;
      let p2Games = 0;
      for (let i = 0; i <= currentGame; i++) {
        const w = checkGameWinner(newP1[i], newP2[i]);
        if (w === 1) p1Games++;
        if (w === 2) p2Games++;
      }

      if (p1Games === 2 || p2Games === 2) {
        const matchWinner = p1Games === 2 ? match.participant1Id._id : match.participant2Id._id;
        toast.success(`Match won by ${p1Games === 2 ? p1Name : p2Name}!`);
        saveToDb(newP1, newP2, MatchStatus.Completed, matchWinner);
      } else {
        // Start next game
        newP1.push(0);
        newP2.push(0);
        setP1Scores(newP1);
        setP2Scores(newP2);
        setCurrentGame(currentGame + 1);
        saveToDb(newP1, newP2, MatchStatus.InProgress);
      }
    } else {
      saveToDb(newP1, newP2, MatchStatus.InProgress);
    }
  };

  const handleUndo = () => {
    if (match.status === MatchStatus.Completed) return;
    
    const newP1 = [...p1Scores];
    const newP2 = [...p2Scores];
    
    if (newP1[currentGame] === 0 && newP2[currentGame] === 0 && currentGame > 0) {
      // Undo game completion
      newP1.pop();
      newP2.pop();
      setCurrentGame(currentGame - 1);
      
      // We must also decrement the winning point of the previous game
      if (newP1[currentGame - 1] > newP2[currentGame - 1]) newP1[currentGame - 1] -= 1;
      else newP2[currentGame - 1] -= 1;
      
    } else {
      // Basic undo (we don't know who scored last, this is simplified. In a real app we'd keep an event log)
      toast.info("Cannot reliably undo mid-game without event log yet.");
      return;
    }
    
    setP1Scores(newP1);
    setP2Scores(newP2);
    saveToDb(newP1, newP2, MatchStatus.InProgress);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col text-white overflow-hidden">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 bg-zinc-900/80 shrink-0">
        <Link href={`/workspace/tournaments/${tournamentId}/operations`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="text-center">
          <h2 className="font-bold text-sm">Court Referee</h2>
          <p className="text-xs text-violet-400">Match {match.round}-{match.matchNumber}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleUndo} disabled={match.status === MatchStatus.Completed}>
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Scoreboard Overview */}
      <div className="h-24 flex items-center justify-center gap-6 border-b border-white/10 bg-zinc-950 shrink-0 px-2">
        <div className="flex-1 flex justify-end gap-2">
          {p1Scores.map((score, i) => (
            <div key={i} className={`w-8 h-10 flex items-center justify-center rounded font-bold ${i === currentGame ? 'bg-violet-600 text-white' : 'bg-white/10 text-muted-foreground'}`}>
              {score}
            </div>
          ))}
        </div>
        <div className="text-muted-foreground text-sm font-semibold">VS</div>
        <div className="flex-1 flex justify-start gap-2">
          {p2Scores.map((score, i) => (
            <div key={i} className={`w-8 h-10 flex items-center justify-center rounded font-bold ${i === currentGame ? 'bg-violet-600 text-white' : 'bg-white/10 text-muted-foreground'}`}>
              {score}
            </div>
          ))}
        </div>
      </div>

      {/* Main Scoring Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Player 1 Button */}
        <button 
          onClick={() => handlePoint(1)}
          disabled={match.status === MatchStatus.Completed}
          className="flex-1 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/10 active:bg-violet-500/20 transition-colors disabled:opacity-50"
        >
          <div className="text-2xl font-bold mb-8 text-center text-violet-300">{p1Name}</div>
          <div className="text-8xl md:text-[150px] font-black tracking-tighter tabular-nums leading-none">
            {p1Scores[currentGame]}
          </div>
          <div className="mt-8 text-sm text-muted-foreground uppercase tracking-widest font-semibold">
            Tap to Score
          </div>
        </button>

        {/* Player 2 Button */}
        <button 
          onClick={() => handlePoint(2)}
          disabled={match.status === MatchStatus.Completed}
          className="flex-1 flex flex-col items-center justify-center p-6 active:bg-emerald-500/20 transition-colors disabled:opacity-50"
        >
          <div className="text-2xl font-bold mb-8 text-center text-emerald-300">{p2Name}</div>
          <div className="text-8xl md:text-[150px] font-black tracking-tighter tabular-nums leading-none">
            {p2Scores[currentGame]}
          </div>
          <div className="mt-8 text-sm text-muted-foreground uppercase tracking-widest font-semibold">
            Tap to Score
          </div>
        </button>
      </div>

      {match.status === MatchStatus.Completed && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-6 text-center">
          <CheckCircle2 className="w-24 h-24 text-emerald-500 mb-6" />
          <h1 className="text-4xl font-bold mb-2">Match Completed</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Winner: {match.winnerId === match.participant1Id._id ? p1Name : p2Name}
          </p>
          <Link href={`/workspace/tournaments/${tournamentId}/operations`}>
            <Button size="lg" className="w-full max-w-sm h-14 text-lg">
              Return to Court Manager
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
