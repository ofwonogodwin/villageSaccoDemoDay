import { NextRequest, NextResponse } from 'next/server';
import { bitnobCardService } from '@/lib/bitnob-card-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get user session for authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // Get all cards for the user
    const result = await bitnobCardService.getAllCards();

    return NextResponse.json({
      success: true,
      message: 'Cards retrieved successfully',
      data: result?.data || [],
    });
  } catch (error: any) {
    console.error('Get cards error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to retrieve cards'
      },
      { status: 500 }
    );
  }
}
