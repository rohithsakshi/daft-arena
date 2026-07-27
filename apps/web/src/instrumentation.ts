import { config } from '@/lib/config';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const dbConnect = (await import('@/lib/db/mongoose')).default;
    const bcrypt = await import('bcryptjs');

    if (!config.SUPER_ADMIN_EMAIL || !config.SUPER_ADMIN_PASSWORD) {
      console.log('[BOOTSTRAP] Super Admin credentials not found in environment. Skipping bootstrap.');
      return;
    }

    try {
      await dbConnect();
      const UserModel = (await import('@/modules/iam/models/User')).UserModel;

      const existingAdmin = await UserModel.findOne({ email: config.SUPER_ADMIN_EMAIL });

      if (existingAdmin) {
        let needsSave = false;
        if (existingAdmin.systemRole !== 'SUPERADMIN') {
          existingAdmin.systemRole = 'SUPERADMIN';
          existingAdmin.onboardingCompleted = true;
          existingAdmin.emailVerified = true;
          needsSave = true;
        }

        // Self-heal the password if it was changed in the environment
        const isPasswordValid = await bcrypt.compare(config.SUPER_ADMIN_PASSWORD, existingAdmin.hashedPassword || '');
        if (!isPasswordValid) {
          existingAdmin.hashedPassword = await bcrypt.hash(config.SUPER_ADMIN_PASSWORD, 10);
          needsSave = true;
        }

        if (needsSave) {
          await existingAdmin.save();
          console.log(`[BOOTSTRAP] ✅ Super Admin repaired`);
          console.log(`[BOOTSTRAP] Email:    ${config.SUPER_ADMIN_EMAIL}`);
          console.log(`[BOOTSTRAP] Role:     SUPERADMIN`);
          console.log(`[BOOTSTRAP] Database: ${config.MONGODB_URI?.split('@').pop() ?? 'connected'}`);
          console.log(`[BOOTSTRAP] Result:   REPAIRED`);
        } else {
          console.log(`[BOOTSTRAP] ✅ Super Admin verified`);
          console.log(`[BOOTSTRAP] Email:    ${config.SUPER_ADMIN_EMAIL}`);
          console.log(`[BOOTSTRAP] Role:     SUPERADMIN`);
          console.log(`[BOOTSTRAP] Database: ${config.MONGODB_URI?.split('@').pop() ?? 'connected'}`);
          console.log(`[BOOTSTRAP] Result:   ALREADY_EXISTS_OK`);
        }
      } else {
        // Create fresh super admin
        const hashedPassword = await bcrypt.hash(config.SUPER_ADMIN_PASSWORD, 10);
        await UserModel.create({
          name: config.SUPER_ADMIN_NAME || 'DAFT Labs',
          email: config.SUPER_ADMIN_EMAIL,
          hashedPassword,
          systemRole: 'SUPERADMIN',
          onboardingCompleted: true,
          emailVerified: true,
          authProvider: 'LOCAL',
        });

        console.log(`[BOOTSTRAP] ✅ Super Admin created`);
        console.log(`[BOOTSTRAP] Email:    ${config.SUPER_ADMIN_EMAIL}`);
        console.log(`[BOOTSTRAP] Role:     SUPERADMIN`);
        console.log(`[BOOTSTRAP] Database: ${config.MONGODB_URI?.split('@').pop() ?? 'connected'}`);
        console.log(`[BOOTSTRAP] Result:   CREATED`);
      }
    } catch (err) {
      console.error('[BOOTSTRAP] ❌ Failed to bootstrap Super Admin:', err);
    }
  }
}
