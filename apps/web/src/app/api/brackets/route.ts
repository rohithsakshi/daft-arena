import { NextRequest, NextResponse } from 'next/server';
import { BracketService } from '../../../modules/brackets/services/BracketService';
import { BracketCreateSchema } from '../../../modules/brackets/validators/BracketSchema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request payload
    const validatedData = BracketCreateSchema.parse(body);
    
    // Check permissions
    // await bracketPermissionService.canCreateBracket(userId, validatedData.tournamentId)
    
    const bracketService = new BracketService();
    const newBracket = await bracketService.createBracket(validatedData);
    
    return NextResponse.json({ success: true, data: newBracket }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    
    if (!eventId) {
      return NextResponse.json({ success: false, error: "eventId is required" }, { status: 400 });
    }
    
    // Call repository to fetch brackets by eventId
    return NextResponse.json({ success: true, data: [] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
