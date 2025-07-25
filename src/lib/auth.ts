import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔐 Login attempt started');

        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('❌ Missing credentials');
            throw new Error('Email and password are required');
          }

          const email = credentials.email.trim().toLowerCase();
          const password = credentials.password;

          console.log('🔍 Looking up user:', email);

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              passwordHash: true,
              role: true,
              isApproved: true
            }
          });

          if (!user) {
            console.error('❌ User not found:', email);
            throw new Error('Invalid email or password');
          }

          console.log('✅ User found:', {
            id: user.id,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved
          });

          console.log('🔒 Verifying password...');

          const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

          if (!isPasswordValid) {
            console.error('❌ Invalid password for user:', email);
            throw new Error('Invalid email or password');
          }

          console.log('✅ Password verified successfully');

          if (!user.isApproved) {
            console.error('❌ User not approved:', email);
            throw new Error('Your account is not yet approved by the admin. Please wait for approval or contact support.');
          }

          console.log('✅ Login successful for user:', email);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isApproved: user.isApproved
          };

        } catch (error: any) {
          console.error('💥 Login error:', {
            message: error.message,
            email: credentials?.email,
            stack: error.stack
          });

          // Re-throw the error with the original message for user feedback
          throw error;
        } finally {
          await prisma.$disconnect();
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('📝 JWT callback - token:', !!token, 'user:', !!user);

      if (user) {
        token.role = user.role;
        token.isApproved = user.isApproved;
        console.log('✅ JWT token updated with user data');
      }
      return token;
    },
    async session({ session, token }) {
      console.log('📝 Session callback - session:', !!session, 'token:', !!token);

      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.isApproved = token.isApproved as boolean;
        console.log('✅ Session updated with token data');
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};
