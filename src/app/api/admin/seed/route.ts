import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  console.log('🌱 Admin seeding API called');

  try {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development' },
        { status: 403 }
      );
    }

    const { adminEmail = 'admin@villagesacco.com', adminPassword = 'admin123456' } = await request.json().catch(() => ({}));

    console.log('🔍 Checking if admin already exists...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('✅ Admin already exists:', existingAdmin.email);
      return NextResponse.json({
        message: 'Admin user already exists',
        admin: {
          email: existingAdmin.email,
          name: existingAdmin.name
        }
      });
    }

    console.log('🔐 Creating admin user...');

    // Hash admin password
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: adminEmail,
        passwordHash: passwordHash,
        role: 'ADMIN',
        isApproved: true // Admin is pre-approved
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isApproved: true
      }
    });

    console.log('✅ Admin user created successfully:', {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    });

    return NextResponse.json({
      message: 'Admin user created successfully',
      admin: {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        isApproved: adminUser.isApproved
      },
      credentials: {
        email: adminEmail,
        password: adminPassword
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('💥 Admin seeding error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    return NextResponse.json(
      {
        error: 'Failed to create admin user',
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
