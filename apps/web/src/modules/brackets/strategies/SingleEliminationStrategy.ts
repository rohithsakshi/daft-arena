// @ts-nocheck
import { IBracketStrategy, DrawGenerationResult } from './IBracketStrategy';
import { IBracket } from '../models/Bracket';
import { ISeed } from '../models/Seed';

import mongoose from 'mongoose';
import { IRound } from '../models/Round';
import { IMatch, MatchState } from '../models/Match';
import { IProgressionRule } from '../models/ProgressionRule';
import { IDraw } from '../models/Draw';
export class SingleEliminationStrategy implements IBracketStrategy {
  async generateDraw(
    bracket: IBracket, 
    seeds: ISeed[], 
    rulePackageContext: unknown
  ): Promise<DrawGenerationResult> {
    const participantIds = seeds.map(s => s.participantId);
    const n = participantIds.length;
    if (n < 2) throw new Error("At least 2 participants required");

    const p = Math.pow(2, Math.ceil(Math.log2(n)));
    const byes = p - n;

    const rounds: Partial<IRound>[] = [];
    const matches: Partial<IMatch>[] = [];
    const progressionRules: Partial<IProgressionRule>[] = [];

    const numRounds = Math.log2(p);
    
    // We will build matches round by round, storing them to wire up progression later
    const matchesByRound: Record<number, Partial<IMatch>[]> = {};
    const matchIdCounter = 1;

    for (let r = 1; r <= numRounds; r++) {
      const numMatchesInRound = p / Math.pow(2, r);
      
      const roundId = new mongoose.Types.ObjectId();
      rounds.push({
        _id: roundId,
        drawId: bracket._id,
        name: r === numRounds ? "Final" : (r === numRounds - 1 ? "Semifinals" : (r === numRounds - 2 ? "Quarterfinals" : `Round ${r}`)),
        sequenceNumber: r,
        isConsolation: false
      });

      matchesByRound[r] = [];
      for (let m = 0; m < numMatchesInRound; m++) {
        matchesByRound[r].push({
          _id: new mongoose.Types.ObjectId(),
          tournamentId: bracket.tournamentId,
          drawId: bracket._id, // Will be set properly by service
          roundId: roundId,
          participants: [], // Populated later
          status: MatchState.CREATED
        });
      }
      matches.push(...matchesByRound[r]);
    }

    // Populate Round 1 participants
    const r1Matches = matchesByRound[1];
    let seedIdx = 0;
    
    // Simplistic assignment:
    // In a real seeded draw, 1 plays 16, 8 plays 9, etc.
    // For now, sequential assignment for the MVP.
    for (let i = 0; i < r1Matches.length; i++) {
      if (seedIdx < participantIds.length) r1Matches[i].participants!.push(participantIds[seedIdx++]);
      if (seedIdx < participantIds.length) r1Matches[i].participants!.push(participantIds[seedIdx++]);
    }

    // Progression wire-up
    for (let r = 1; r < numRounds; r++) {
      const currentRoundMatches = matchesByRound[r];
      const nextRoundMatches = matchesByRound[r + 1];
      
      for (let m = 0; m < currentRoundMatches.length; m++) {
        const nextMatch = nextRoundMatches[Math.floor(m / 2)];
        
        // Link the match
        currentRoundMatches[m].nextMatchId = nextMatch._id;
        
        // Add progression rule
        progressionRules.push({
          sourceMatchId: currentRoundMatches[m]._id,
          targetMatchId: nextMatch._id,
          targetPosition: m % 2 === 0 ? 0 : 1,
          condition: 'Winner'
        });
      }
    }

    // Create draw record
    const draw: Partial<IDraw> = {
      bracketId: bracket._id,
      name: "Main Draw",
      published: false,
      isPrimary: true
    };

    return {
      draw,
      rounds,
      matches,
      progressionRules
    };
  }

  validateParticipantCount(count: number, rulePackageContext: unknown): boolean {
    return count >= 2; 
  }
}
