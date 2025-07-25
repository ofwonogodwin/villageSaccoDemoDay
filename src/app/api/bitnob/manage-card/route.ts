import { NextRequest, NextResponse } from 'next/server';
import { bitnobCardService } from '@/lib/bitnob-card-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get user session for authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { cardId, action, reason } = body;

    // Validate input
    if (!cardId || !action) {
      return NextResponse.json(
        { error: 'Card ID and action are required' },
        { status: 400 }
      );
    }

    if (!['freeze', 'unfreeze'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Use "freeze" or "unfreeze"' },
        { status: 400 }
      );
    }

    let result;
    const payload = {
      cardId,
      reason: reason || `Card ${action} requested by ${session.user.email}`
    };

    if (action === 'freeze') {
      result = await bitnobCardService.freezeCard(payload);
    } else {
      result = await bitnobCardService.unfreezeCard(payload);
    }

    return NextResponse.json({
      success: true,
      message: `Card ${action}d successfully`,
      data: {
        cardId: cardId,
        action: action,
        timestamp: new Date().toISOString(),
        reason: payload.reason
      },
    });
  } catch (error: any) {
    console.error('Card management error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to manage card'
      },
      { status: 500 }
    );
  }
}
