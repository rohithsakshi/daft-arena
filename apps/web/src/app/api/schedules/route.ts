import { NextRequest, NextResponse } from 'next/server';
import { ScheduleEntryCreateSchema } from '../../../modules/scheduling/validators/ScheduleSchema';
import { ScheduleEntryModel } from '../../../modules/scheduling/models/ScheduleEntry';
import { MatchModel, MatchState } from '../../../modules/brackets/models/Match';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request payload
    const validatedData = ScheduleEntryCreateSchema.parse(body);
    
    // Basic conflict detection
    const conflicts = await ScheduleEntryModel.find({
      $or: [
        { playingAreaId: validatedData.playingAreaId },
        { participantIds: { $in: validatedData.participantIds } }
      ],
      $and: [
        { startTime: { $lt: validatedData.endTime } },
        { endTime: { $gt: validatedData.startTime } }
      ]
    });
    
    if (conflicts.length > 0) {
      return NextResponse.json({ success: false, error: "Scheduling conflict detected." }, { status: 409 });
    }
    
    const newEntry = await ScheduleEntryModel.create(validatedData);
    
    // Update match state
    await MatchModel.findByIdAndUpdate(validatedData.matchId, { status: MatchState.SCHEDULED });
    
    return NextResponse.json({ success: true, data: newEntry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
