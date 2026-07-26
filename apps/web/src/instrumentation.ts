import { config } from '@/lib/config';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const dbConnect = (await import('@/lib/db/mongoose')).default;
    const { UserRepository } = await import('@/modules/iam/repositories/user.repository');
    const bcrypt = await import('bcryptjs');

    await dbConnect();
    const userRepo = new UserRepository();

    if (!config.SUPER_ADMIN_EMAIL || !config.SUPER_ADMIN_PASSWORD) {
      console.log('[BOOTSTRAP] Super Admin credentials not found in environment. Skipping bootstrap.');
      return;
    }

    const existingAdmin = await userRepo.findByEmail(config.SUPER_ADMIN_EMAIL);
    
    if (existingAdmin) {
      console.log(`[BOOTSTRAP] Super Admin (${config.SUPER_ADMIN_EMAIL}) already exists. Skipping.`);
    } else {
      console.log(`[BOOTSTRAP] Super Admin not found. Creating...`);
      const hashedPassword = await bcrypt.hash(config.SUPER_ADMIN_PASSWORD, 10);
      
      // We assume User model has create method or we can use mongoose model directly.
      // Since userRepo might not expose raw creation easily without DTOs, let's use the Mongoose model directly for bootstrap.
      const UserModel = (await import('@/modules/iam/models/User')).UserModel;
      
      await UserModel.create({
        name: config.SUPER_ADMIN_NAME || 'Super Admin',
        email: config.SUPER_ADMIN_EMAIL,
        hashedPassword,
      });

      console.log(`[BOOTSTRAP] Super Admin successfully created.`);
    }
  }
}
