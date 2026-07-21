import { NextRequest, NextResponse } from 'next/server';
import { roleRepository } from '../../../../lib/container';
import { withPermission } from '../../../../modules/iam/guards/permission.guard';
import { RoleSchema } from '../../../../modules/iam/schemas/role.schema';
import { z } from 'zod';

export const GET = withPermission('VIEW_ROLES', async (req: NextRequest) => {
  const roles = await roleRepository.findAll();
  return NextResponse.json({ data: roles }, { status: 200 });
});

export const POST = withPermission('MANAGE_ROLES', async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = RoleSchema.parse(body);

    const role = await roleRepository.create(data as any);
    return NextResponse.json({ data: role }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: (error as z.ZodError).issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
