import { NextRequest, NextResponse } from 'next/server';
import { permissionRepository } from '../../../../../lib/container';
import { withPermission } from '../../../../../modules/iam/guards/permission.guard';

export const GET = withPermission('VIEW_PERMISSIONS', async (req) => {
  const permissions = await permissionRepository.findAllPermissions();
  return NextResponse.json({ data: permissions }, { status: 200 });
});
