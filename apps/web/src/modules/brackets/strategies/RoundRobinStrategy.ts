import { IBracketStrategy, DrawGenerationResult } from './IBracketStrategy';
import { IBracket } from '../models/Bracket';
import { ISeed } from '../models/Seed';
import mongoose from 'mongoose';
import { IRound } from '../models/Round';
import { IMatch, MatchState } from '../models/Match';
import { IProgressionRule } from '../models/ProgressionRule';
import { IDraw } from '../models/Draw';

export class RoundRobinStrategy implements IBracketStrategy {
  async generateDraw(
    bracket: IBracket, 
    seeds: ISeed[], 
    rulePackageContext: any
  ): Promise<DrawGenerationResult> {
    const participantIds = seeds.map(s => s.participantId);
    let n = participantIds.length;
    if (n < 3) throw new Error("At least 3 participants required for Round Robin");

    const rounds: Partial<IRound>[] = [];
    const matches: Partial<IMatch>[] = [];

    // Circle method for Round Robin scheduling
    const players = [...participantIds];
    if (n % 2 !== 0) {
      players.push('BYE' as any);
      n++;
    }

    const numRounds = n - 1;
    const matchesPerRound = n / 2;

    for (let r = 1; r <= numRounds; r++) {
      const roundId = new mongoose.Types.ObjectId();
      rounds.push({
        _id: roundId,
        drawId: bracket._id,
        name: `Round ${r}`,
        sequenceNumber: r,
        isConsolation: false
      });

      for (let m = 0; m < matchesPerRound; m++) {
        const p1 = players[m];
        const p2 = players[n - 1 - m];

        if (p1 !== 'BYE' && p2 !== 'BYE') {
          matches.push({
            _id: new mongoose.Types.ObjectId(),
            tournamentId: bracket.tournamentId,
            drawId: bracket._id, // Will be set by service
            roundId: roundId,
            participants: [p1, p2],
            status: MatchState.CREATED
          });
        }
      }

      // Rotate players for next round (keep index 0 fixed, rotate others clockwise)
      players.splice(1, 0, players.pop()!);
    }

    const draw: Partial<IDraw> = {
      bracketId: bracket._id,
      name: "Pool Play",
      published: false,
      isPrimary: true
    };

    return { draw, rounds, matches, progressionRules: [] };
  }

  validateParticipantCount(count: number, rulePackageContext: any): boolean {
    return count >= 3 && count <= rulePackageContext.maxPlayers;
  }
}
