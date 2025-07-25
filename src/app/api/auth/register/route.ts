import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  console.log('Registration API called');

  try {
    const body = await request.json();
    console.log('📝 Request body received:', { ...body, password: '[HIDDEN]' });

    const { name, email, password } = body;

    // Comprehensive input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      console.error('❌ Validation error: Invalid name');
      return NextResponse.json(
        { error: 'Name is required and must be a valid string' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.error('❌ Validation error: Invalid email');
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      console.error('❌ Validation error: Invalid password');
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      console.error('❌ Validation error: Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();

    console.log('🔍 Checking if user exists with email:', sanitizedEmail);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail }
    });

    if (existingUser) {
      console.error('❌ User already exists:', sanitizedEmail);
      return NextResponse.json(
        { error: 'A user with this email address already exists' },
        { status: 409 }
      );
    }

    console.log('🔐 Hashing password...');

    // Hash password with proper salt rounds
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    console.log('✅ Password hashed successfully');

    console.log('💾 Creating user in database...');

    // Create user with all required fields
    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        passwordHash: passwordHash,
        role: 'USER',
        isApproved: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isApproved: true,
        createdAt: true
      }
    });

    console.log('✅ User created successfully:', {
      id: user.id,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! Your account is pending admin approval.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isApproved: user.isApproved
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('💥 Registration error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      console.error('❌ Prisma unique constraint violation');
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }

    if (error.code === 'P2025') {
      console.error('❌ Prisma record not found');
      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: 400 }
      );
    }

    // Handle bcrypt errors
    if (error.message.includes('bcrypt')) {
      console.error('❌ Password hashing error');
      return NextResponse.json(
        { error: 'Password processing failed' },
        { status: 500 }
      );
    }

    // Handle database connection errors
    if (error.message.includes('database') || error.message.includes('connection')) {
      console.error('❌ Database connection error');
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }

    // Generic error
    console.error('❌ Unexpected registration error:', error);
    return NextResponse.json(
      {
        error: 'Registration failed due to an internal error. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    // Ensure Prisma client is disconnected
    await prisma.$disconnect();
  }
}
