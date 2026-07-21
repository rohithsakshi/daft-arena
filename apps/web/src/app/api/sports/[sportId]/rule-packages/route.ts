import { NextRequest, NextResponse } from 'next/server';
import { rulePackageService } from '../../../../../lib/container';
import { CreateRulePackageSchema } from '../../../../../modules/sports/validators/rulePackage.schema';
import { withAuth } from '../../../../../modules/iam/guards/auth.guard';
import { withPermission } from '../../../../../modules/iam/guards/permission.guard';
import { z } from 'zod';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ sportId: string }> }) => {
  const { sportId } = await params;
  // Return all published rule packages for a sport.
  // We'll leave filtering/pagination implementation for later
  return NextResponse.json({ message: 'List published packages for sport' }, { status: 200 });
};

export const POST = withPermission('MANAGE_SPORTS', async (req: NextRequest, user: { sub: string }, { params }: { params: Promise<{ sportId: string }> }) => {
  try {
    const { sportId } = await params;
    const body = await req.json();
    // Validate request
    const data = CreateRulePackageSchema.parse({ ...body, sportId });

    const rulePackage = await rulePackageService.createPackage(sportId, data as any, user.sub as string);
    return NextResponse.json({ data: rulePackage }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: (error as z.ZodError).issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
});
