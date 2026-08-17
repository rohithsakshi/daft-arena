import { ITournamentEvent } from '../models/Event';
import { IRegistration } from '../models/Registration';
import mongoose from 'mongoose';

export interface MatchNode {
  id: string;
  round: number;
  matchNumber: number;
  player1: IRegistration | 'BYE' | null;
  player2: IRegistration | 'BYE' | null;
  winner?: IRegistration | 'BYE';
  nextMatchId?: string;
}

export class DrawGenerator {
  
  static generateKnockoutDraw(event: ITournamentEvent, registrations: IRegistration[]): MatchNode[] {
    // Keep the entire Registration object, preserving the passed order
    const participants = [...registrations]; 
    
    // Calculate nearest power of 2
    const n = participants.length;
    let power = 1;
    while (power < n) power *= 2;
    
    const byes = power - n;
    
    // Distribute Byes evenly (for simplicity, we push byes to the end)
    const firstRoundMatches = power / 2;
    const matches: MatchNode[] = [];
    
    let participantIndex = 0;
    
    // Generate First Round
    for (let i = 1; i <= firstRoundMatches; i++) {
      let p1: IRegistration | 'BYE' | null = null;
      let p2: IRegistration | 'BYE' | null = null;
      
      if (participantIndex < participants.length) p1 = participants[participantIndex++];
      
      // If we have remaining byes, we assign a BYE instead of a second player
      if (byes > (firstRoundMatches - i)) {
        p2 = 'BYE';
      } else {
        if (participantIndex < participants.length) p2 = participants[participantIndex++];
      }
      
      matches.push({
        id: `R1-M${i}`,
        round: 1,
        matchNumber: i,
        player1: p1,
        player2: p2,
        winner: p2 === 'BYE' ? (p1 || undefined) : undefined
      });
    }
    
    // Generate subsequent rounds
    let currentRoundMatches = firstRoundMatches / 2;
    let round = 2;
    let previousRoundStart = 0;
    let previousRoundCount = firstRoundMatches;
    
    while (currentRoundMatches >= 1) {
      for (let i = 1; i <= currentRoundMatches; i++) {
        const matchId = `R${round}-M${i}`;
        const matchNode: MatchNode = {
          id: matchId,
          round: round,
          matchNumber: i,
          player1: null,
          player2: null
        };
        
        // Link previous round matches to this match
        const prev1 = matches[previousRoundStart + (i * 2) - 2];
        const prev2 = matches[previousRoundStart + (i * 2) - 1];
        
        prev1.nextMatchId = matchId;
        prev2.nextMatchId = matchId;
        
        // If both previous matches were BYEs (advanced automatically), carry them over
        if (prev1.winner) matchNode.player1 = prev1.winner;
        if (prev2.winner) matchNode.player2 = prev2.winner;
        
        // If this match now has both players via byes, and one is BYE (not possible with standard logic but safe fallback)
        if (matchNode.player2 === 'BYE') matchNode.winner = matchNode.player1 || undefined;
        
        matches.push(matchNode);
      }
      
      previousRoundStart += previousRoundCount;
      previousRoundCount = currentRoundMatches;
      currentRoundMatches /= 2;
      round++;
    }
    
    return matches;
  }
}
