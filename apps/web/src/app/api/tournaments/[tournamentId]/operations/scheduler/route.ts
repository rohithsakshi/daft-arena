import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { MatchModel } from '@/modules/tournaments/models/Match';
import { MatchStatus } from '@/modules/core/enums';

export async function POST(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;
    const body = await req.json();

    const { 
      startDate, 
      startTimeOfDay, 
      endTimeOfDay, 
      matchDuration, 
      restDuration, 
      availableCourtIds,
      availableUmpireIds = []
    } = body;

    if (!startDate || !startTimeOfDay || !endTimeOfDay || !matchDuration || !availableCourtIds || availableCourtIds.length === 0) {
      return NextResponse.json({ error: 'Missing required scheduling parameters' }, { status: 400 });
    }

    // Parse configuration
    const [startHour, startMin] = startTimeOfDay.split(':').map(Number);
    const [endHour, endMin] = endTimeOfDay.split(':').map(Number);
    const tournamentStartDate = new Date(startDate);
    tournamentStartDate.setHours(startHour, startMin, 0, 0);
    
    let currentScheduleTime = new Date(tournamentStartDate.getTime());
    const endOfDayTime = new Date(startDate);
    endOfDayTime.setHours(endHour, endMin, 0, 0);

    // Fetch all Unassigned / Scheduled matches for the tournament across all events
    // We sort them by Event (to group), then by Round, then by MatchNumber
    // But wait, across events, how do we prioritize? 
    // Usually, we schedule Round 1 of all events first, then Round 2 of all events, etc.
    const matches = await MatchModel.find({ 
      tournamentId, 
      status: MatchStatus.Scheduled,
      isWalkover: false
    })
      .populate('participant1Id')
      .populate('participant2Id')
      .sort({ round: 1, eventId: 1, matchNumber: 1 });

    if (matches.length === 0) {
      return NextResponse.json({ error: 'No unassigned matches found to schedule' }, { status: 400 });
    }

    // State Tracking
    const courtNextAvailableTime = new Map<string, number>(); // courtId -> timestamp
    availableCourtIds.forEach((c: string) => courtNextAvailableTime.set(c, currentScheduleTime.getTime()));

    const umpireNextAvailableTime = new Map<string, number>(); // umpireId -> timestamp
    availableUmpireIds.forEach((u: string) => umpireNextAvailableTime.set(u, currentScheduleTime.getTime()));

    const playerNextAvailableTime = new Map<string, number>(); // participantId (Registration ID) -> timestamp
    const scheduledMatches = [];
    const unscheduledMatches = [];

    // Helper: Find the earliest available court
    const getEarliestCourt = (currentTime: number) => {
      let earliestCourtId = null;
      let earliestTime = Infinity;
      
      for (const [courtId, time] of courtNextAvailableTime.entries()) {
        if (time < earliestTime) {
          earliestTime = time;
          earliestCourtId = courtId;
        }
      }
      
      // We can't schedule before the general currentTime
      return { 
        courtId: earliestCourtId, 
        time: Math.max(earliestTime, currentTime) 
      };
    };

    // Helper: Find available umpire
    const getAvailableUmpire = (time: number) => {
      if (availableUmpireIds.length === 0) return null;
      for (const [umpireId, availableTime] of umpireNextAvailableTime.entries()) {
        if (availableTime <= time) {
          return umpireId;
        }
      }
      // If all are busy, just return the one that gets free earliest
      let earliestUmpireId = null;
      let earliestTime = Infinity;
      for (const [umpireId, availableTime] of umpireNextAvailableTime.entries()) {
        if (availableTime < earliestTime) {
          earliestTime = availableTime;
          earliestUmpireId = umpireId;
        }
      }
      return earliestUmpireId;
    };

    // Algorithm: Iterating through matches
    for (const match of matches) {
      const p1Id = (match.participant1Id as any)?._id?.toString();
      const p2Id = (match.participant2Id as any)?._id?.toString();
      
      // Calculate when both players are available
      let p1AvailableTime = p1Id ? (playerNextAvailableTime.get(p1Id) || currentScheduleTime.getTime()) : currentScheduleTime.getTime();
      let p2AvailableTime = p2Id ? (playerNextAvailableTime.get(p2Id) || currentScheduleTime.getTime()) : currentScheduleTime.getTime();
      
      let playersAvailableTime = Math.max(p1AvailableTime, p2AvailableTime, currentScheduleTime.getTime());

      // Get court available at or after players are ready
      let { courtId, time: courtAvailableTime } = getEarliestCourt(playersAvailableTime);
      let matchStartTime = Math.max(playersAvailableTime, courtAvailableTime);

      // Check if we pushed past end of day. If so, move to next day!
      if (matchStartTime >= endOfDayTime.getTime()) {
        // Increment day
        tournamentStartDate.setDate(tournamentStartDate.getDate() + 1);
        endOfDayTime.setDate(endOfDayTime.getDate() + 1);
        
        currentScheduleTime = new Date(tournamentStartDate.getTime());
        
        // Reset courts
        availableCourtIds.forEach((c: string) => courtNextAvailableTime.set(c, currentScheduleTime.getTime()));
        availableUmpireIds.forEach((u: string) => umpireNextAvailableTime.set(u, currentScheduleTime.getTime()));
        
        // Recalculate
        playersAvailableTime = Math.max(p1AvailableTime, p2AvailableTime, currentScheduleTime.getTime());
        const newCourt = getEarliestCourt(playersAvailableTime);
        courtId = newCourt.courtId;
        matchStartTime = Math.max(playersAvailableTime, newCourt.time);
      }

      // We have a court and time!
      const matchEndTime = matchStartTime + (matchDuration * 60000);
      
      // Get Umpire
      let umpireId = null;
      if (availableUmpireIds.length > 0) {
        umpireId = getAvailableUmpire(matchStartTime);
        if (umpireId) {
          umpireNextAvailableTime.set(umpireId, matchEndTime + (5 * 60000)); // 5 min rest for umpire
        }
      }

      // Update state
      courtNextAvailableTime.set(courtId as string, matchEndTime + (5 * 60000)); // 5 min buffer for court
      
      // Add rest duration for players
      const nextPlayerAvail = matchEndTime + (restDuration * 60000);
      if (p1Id) playerNextAvailableTime.set(p1Id, nextPlayerAvail);
      if (p2Id) playerNextAvailableTime.set(p2Id, nextPlayerAvail);

      // Save schedule
      match.courtId = (courtId as string) || undefined;
      match.umpireId = umpireId || undefined;
      match.startTime = new Date(matchStartTime);
      match.endTime = new Date(matchEndTime);
      
      await match.save();
      
      scheduledMatches.push(match._id);
      
      // Advance general current time very slightly so loops progress
      currentScheduleTime = new Date(Math.min(...Array.from(courtNextAvailableTime.values())));
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        scheduledCount: scheduledMatches.length,
        unscheduledCount: unscheduledMatches.length
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
