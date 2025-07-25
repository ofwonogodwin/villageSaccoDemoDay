import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAdminLogin() {
  try {
    console.log('🔍 Testing admin login...');

    // Get admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@villagesacco.com' },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true,
        isApproved: true
      }
    });

    if (!admin) {
      console.error('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin user found:', {
      email: admin.email,
      role: admin.role,
      isApproved: admin.isApproved
    });

    // Test password verification
    const testPassword = 'admin123';
    console.log('🔒 Testing password:', testPassword);
    console.log('📝 Stored hash length:', admin.passwordHash.length);
    console.log('📝 Hash preview:', admin.passwordHash.substring(0, 20) + '...');

    const isValid = await bcrypt.compare(testPassword, admin.passwordHash);
    console.log('✅ Password verification result:', isValid);

    if (!isValid) {
      console.log('🔨 Generating new hash for comparison...');
      const newHash = await bcrypt.hash(testPassword, 12);
      console.log('📝 New hash:', newHash.substring(0, 20) + '...');

      const testNewHash = await bcrypt.compare(testPassword, newHash);
      console.log('✅ New hash verification:', testNewHash);
    }

  } catch (error) {
    console.error('❌ Error testing admin login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminLogin();
