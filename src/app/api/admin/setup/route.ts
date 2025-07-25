import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 400 }
      );
    }

    // Create default admin user
    const passwordHash = await bcrypt.hash('admin123', 12);

    const admin = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: 'admin@villagesacco.com',
        passwordHash,
        role: 'ADMIN',
        isApproved: true
      }
    });

    return NextResponse.json(
      {
        message: 'Admin user created successfully',
        email: admin.email,
        note: 'Please change the default password after first login'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    });

    return NextResponse.json({
      hasAdmin: adminCount > 0,
      adminCount
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
