import { NextRequest, NextResponse } from 'next/server';
import { BracketService } from '../../../../modules/brackets/services/BracketService';

export async function GET(req: NextRequest, context: { params: Promise<{ bracketId: string }> }) {
  try {
    const params = await context.params;
    // Fetch Bracket
    return NextResponse.json({ success: true, data: { id: params.bracketId } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ bracketId: string }> }) {
  try {
    const params = await context.params;
    const bracketService = new BracketService();
    await bracketService.archiveBracket(params.bracketId);
    
    return NextResponse.json({ success: true, message: "Bracket archived" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
