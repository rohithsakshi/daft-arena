import { connectDB } from '../../../lib/mongodb';
import { UserModel } from '../models/User';
import { RoleModel } from '../models/Role';
import { OrganizationModel } from '../models/Organization';
import { OrganizationMembershipModel } from '../models/OrganizationMembership';
import { PermissionModel } from '../models/Permission';
import { PermissionGroupModel } from '../models/PermissionGroup';
import * as bcrypt from 'bcryptjs';

export async function seedIam() {
  console.log('Connecting to DB for seeding IAM...');
  await connectDB();

  console.log('Seeding IAM...');

  // 1. Create Default Organization
  let org = await OrganizationModel.findOne({ name: 'Default Organization' });
  if (!org) {
    org = await OrganizationModel.create({
      name: 'Default Organization',
      description: 'The primary organization for the system',
    });
  }

  // 2. Create Permission Group
  let group = await PermissionGroupModel.findOne({ code: 'SYSTEM_ADMIN' });
  if (!group) {
    group = await PermissionGroupModel.create({
      code: 'SYSTEM_ADMIN',
      name: 'System Administration',
      description: 'Core system administration permissions',
    });
  }

  // 3. Create Permissions
  const permissions = [
    { code: 'SUPER_ADMIN', name: 'Super Admin', description: 'Full access' },
    { code: 'VIEW_ROLES', name: 'View Roles', description: 'Can view roles' },
    { code: 'MANAGE_ROLES', name: 'Manage Roles', description: 'Can manage roles' },
    { code: 'VIEW_PERMISSIONS', name: 'View Permissions', description: 'Can view permissions' },
  ];

  for (const p of permissions) {
    const exists = await PermissionModel.findOne({ code: p.code });
    if (!exists) {
      await PermissionModel.create({
        ...p,
        permissionGroupId: group._id as unknown as string,
      });
    }
  }

  // 4. Create Super Admin Role
  const superAdminPerm = await PermissionModel.findOne({ code: 'SUPER_ADMIN' });
  let superAdminRole = await RoleModel.findOne({ code: 'SUPER_ADMIN_ROLE' });
  if (!superAdminRole) {
    superAdminRole = await RoleModel.create({
      code: 'SUPER_ADMIN_ROLE',
      name: 'Super Administrator',
      description: 'System Administrator with full permissions',
      permissions: superAdminPerm ? [superAdminPerm._id as unknown as string] : [],
    });
  }

  // 5. Create Initial Admin User
  const adminEmail = 'admin@daftarena.com';
  const hashedPassword = await bcrypt.hash('Admin@123!', 10);
  
  let adminUser = await UserModel.findOne({ email: adminEmail });
  if (!adminUser) {
    adminUser = await UserModel.create({
      email: adminEmail,
      name: 'System Admin',
      hashedPassword,
    });
  }

  // 6. Assign User to Role in Organization
  const existingMembership = await OrganizationMembershipModel.findOne({
    userId: adminUser._id as unknown as string,
    organizationId: org._id as unknown as string
  });

  if (!existingMembership) {
    await OrganizationMembershipModel.create({
      userId: adminUser._id as unknown as string,
      organizationId: org._id as unknown as string,
      roleId: superAdminRole._id as unknown as string,
    });
  }

  console.log('IAM Seeding completed.');
}

if (require.main === module) {
  seedIam()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
