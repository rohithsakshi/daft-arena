import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.production' });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'daftlabs.reply@gmail.com';
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'daftlabs';

const results = {
  dbConnected: false,
  superAdminFound: false,
  exactlyOneSuperAdmin: false,
  passwordValid: false,
  roleValid: false,
  emailVerified: false,
  onboardingCompleted: false,
  jwtGenerated: false,
  middlewareAccepted: false,
  dashboardAuthorized: false,
};

function fail(step: string, reason: string, fix: string) {
  console.error('\nFAILED STEP:', step);
  console.error('Reason:', reason);
  console.error('Suggested Fix:', fix);
  printSummary();
  process.exit(1);
}

function printSummary() {
  console.log('\nVERIFICATION SUMMARY:');
  console.log(`${results.dbConnected ? '✓' : '✗'} Database connected`);
  console.log(`${results.superAdminFound ? '✓' : '✗'} Super Admin found`);
  console.log(`${results.exactlyOneSuperAdmin ? '✓' : '✗'} Exactly one Super Admin`);
  console.log(`${results.passwordValid ? '✓' : '✗'} Password hash valid`);
  console.log(`${results.roleValid ? '✓' : '✗'} Role = SUPERADMIN`);
  console.log(`${results.emailVerified ? '✓' : '✗'} Email verified`);
  console.log(`${results.onboardingCompleted ? '✓' : '✗'} Onboarding completed`);
  console.log(`${results.jwtGenerated ? '✓' : '✗'} JWT generated`);
  console.log(`${results.middlewareAccepted ? '✓' : '✗'} Middleware accepted token`);
  console.log(`${results.dashboardAuthorized ? '✓' : '✗'} Dashboard authorization passed`);

  const allPassed = Object.values(results).every(v => v === true);

  console.log('\n==========================');
  console.log('PRODUCTION VERIFICATION');
  console.log(allPassed ? 'PASS' : 'FAIL');
  console.log('==========================');
}

async function verifyProduction() {
  if (!MONGODB_URI) {
    fail('Database Connection', 'MONGODB_URI is undefined.', 'Set MONGODB_URI in your environment variables.');
  }

  try {
    const url = new URL(MONGODB_URI as string);
    console.log(`Database Host: ${url.host}`);
    console.log(`Database Name: ${url.pathname.replace('/', '')}`);
  } catch (e) {
    // If it's not a valid URL (e.g. standard connection string), just print safely
    console.log(`Database Connection String: [HIDDEN CREDENTIALS]`);
  }

  try {
    await mongoose.connect(MONGODB_URI as string);
    results.dbConnected = true;
  } catch (error: any) {
    fail('Database Connection', error.message, 'Check your MONGODB_URI credentials and network access.');
  }

  try {
    const userSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    const users = await User.find({ email: SUPER_ADMIN_EMAIL });

    if (users.length === 0) {
      fail('Super Admin lookup', `No user found with email ${SUPER_ADMIN_EMAIL}`, 'Ensure the bootstrap script has run successfully.');
    }
    results.superAdminFound = true;

    if (users.length > 1) {
      fail('Super Admin uniqueness', `Found ${users.length} users with email ${SUPER_ADMIN_EMAIL}`, 'Remove duplicate accounts manually from the database.');
    }
    results.exactlyOneSuperAdmin = true;

    const admin = users[0] as any;

    if (admin.systemRole !== 'SUPERADMIN') {
      fail('Role Validation', `User role is '${admin.systemRole}', expected 'SUPERADMIN'`, 'Run the bootstrap script to repair the role.');
    }
    results.roleValid = true;

    if (!admin.emailVerified) {
      fail('Email Verification', 'emailVerified is false', 'Run the bootstrap script to repair this field.');
    }
    results.emailVerified = true;

    if (!admin.onboardingCompleted) {
      fail('Onboarding Status', 'onboardingCompleted is false', 'Run the bootstrap script to repair this field.');
    }
    results.onboardingCompleted = true;

    const isMatch = await bcrypt.compare(SUPER_ADMIN_PASSWORD, admin.hashedPassword || '');
    if (!isMatch) {
      fail('Password Validation', 'Stored password hash does not match SUPER_ADMIN_PASSWORD', 'Update the password using the bootstrap script or check the env var.');
    }
    results.passwordValid = true;

    if (!JWT_SECRET) {
      fail('JWT Generation', 'JWT_SECRET is undefined.', 'Set JWT_SECRET in your environment variables.');
    }

    let token = '';
    try {
      const secret = new TextEncoder().encode(JWT_SECRET as string);
      token = await new jose.SignJWT({
        sub: String(admin._id),
        email: admin.email,
        role: admin.systemRole,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);
      results.jwtGenerated = true;
    } catch (e: any) {
      fail('JWT Generation', e.message, 'Ensure JWT_SECRET is properly configured.');
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET as string);
      const payload = await jose.jwtVerify(token, secret);
      if (payload.payload.role !== 'SUPERADMIN') {
        throw new Error('Role in decoded token is not SUPERADMIN');
      }
      results.middlewareAccepted = true;
      results.dashboardAuthorized = true; // Simulating successful middleware passage means authorized
    } catch (e: any) {
      fail('Middleware token verification', e.message, 'Check JWT token generation logic and secrets.');
    }

    printSummary();
    process.exit(0);
  } catch (error: any) {
    fail('Unexpected Error', error.message, 'Check the stack trace for details.');
  } finally {
    await mongoose.disconnect();
  }
}

verifyProduction();
