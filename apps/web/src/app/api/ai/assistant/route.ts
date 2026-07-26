import { NextResponse } from 'next/server';
import { aiEngineService } from '@/modules/ai/services/AIEngineService';

export async function POST(req: Request) {
  try {
    const { query, context } = await req.json();
    const response = await aiEngineService.askAssistant(query, context);
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
