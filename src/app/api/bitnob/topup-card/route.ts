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
    const { cardId, amount, currency, reference } = body;

    // Validate input
    if (!cardId || !amount) {
      return NextResponse.json(
        { error: 'Card ID and amount are required' },
        { status: 400 }
      );
    }

    if (amount < 1) {
      return NextResponse.json(
        { error: 'Minimum top-up amount is $1' },
        { status: 400 }
      );
    }

    // Top up the card using the new service
    const topUpPayload = {
      cardId,
      amount: parseFloat(amount),
      currency: currency || 'USD',
      reference: reference || `Top-up by ${session.user.email}`
    };

    const result = await bitnobCardService.topUpCard(topUpPayload);

    return NextResponse.json({
      success: true,
      message: 'Card topped up successfully',
      data: {
        transactionId: result?.data?.transactionId,
        amount: amount,
        currency: currency || 'USD',
        cardId: cardId,
        timestamp: new Date().toISOString()
      },
    });
  } catch (error: any) {
    console.error('Top-up card error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to top up card'
      },
      { status: 500 }
    );
  }
}
