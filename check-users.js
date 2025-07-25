import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Checking all users in database...');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isApproved: true,
        createdAt: true
      }
    });

    console.log('📊 Total users found:', users.length);
    console.log('\n👥 Users list:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.role}) - Approved: ${user.isApproved}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

    // Check specifically for admin
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    console.log('🔑 Admin user:', admin ? '✅ Found' : '❌ Not found');
    if (admin) {
      console.log('   Email:', admin.email);
      console.log('   Name:', admin.name);
      console.log('   Approved:', admin.isApproved);
    }

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
