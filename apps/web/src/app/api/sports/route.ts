import { NextRequest, NextResponse } from 'next/server';
import { sportService } from '../../../lib/container';
import { CreateSportSchema, UpdateSportSchema } from '../../../modules/sports/validators/sport.schema';
import { withAuth } from '../../../modules/iam/guards/auth.guard';
import { withPermission } from '../../../modules/iam/guards/permission.guard';
import { z } from 'zod';
import { PaginationValidator, SearchValidator } from '../../../modules/core/validators';

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);
  const query = url.searchParams.get('query') || undefined;

  const pagination = PaginationValidator.parse({ page, limit });
  const search = SearchValidator.parse({ query });

  const sports = await sportService.listSports({ ...pagination, ...search });
  return NextResponse.json({ data: sports }, { status: 200 });
};

export const POST = withPermission('MANAGE_SPORTS', async (req: NextRequest, user: { sub: string }) => {
  try {
    const body = await req.json();
    const data = CreateSportSchema.parse(body);

    const sport = await sportService.createSport(data as any, user.sub as string);
    return NextResponse.json({ data: sport }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: (error as z.ZodError).issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 }); // We should use a proper error handler, but this will do for now
  }
});
