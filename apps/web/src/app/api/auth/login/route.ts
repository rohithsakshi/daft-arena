import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../../../../lib/container';
import { LoginSchema } from '../../../../modules/iam/schemas/auth.schema';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = LoginSchema.parse(body);

    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const result = await authService.login(data, ipAddress, userAgent);

    // Set secure cookie for accessToken
    const response = NextResponse.json({ user: result.user }, { status: 200 });
    
    response.cookies.set({
      name: 'accessToken',
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: (error as z.ZodError).issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
