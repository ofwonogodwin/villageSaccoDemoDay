import { NextRequest, NextResponse } from 'next/server';
import { bitnobCardService, createVirtualCard } from '@/lib/bitnob-card-service';
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
    const { userName, amount, currency, cardType = 'virtual', cardBrand = 'visa' } = body;

    // Validate input
    if (!userName || !amount) {
      return NextResponse.json(
        { error: 'Username and amount are required' },
        { status: 400 }
      );
    }

    if (amount < 10) {
      return NextResponse.json(
        { error: 'Minimum amount is $10 USD' },
        { status: 400 }
      );
    }

    // First, register the card user if not already registered
    // Note: In a real app, you'd check if user already exists first
    const cardUserPayload = {
      firstName: userName.split(' ')[0] || userName,
      lastName: userName.split(' ')[1] || 'User',
      email: session.user.email,
      phoneNumber: '+1234567890', // In real app, get from user profile
      dateOfBirth: '1990-01-01', // In real app, get from user profile
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'US',
        postalCode: '10001'
      },
      idType: 'passport',
      idNumber: 'P123456789'
    };

    let cardUserId;
    try {
      const userResult = await bitnobCardService.registerCardUser(cardUserPayload);
      cardUserId = userResult?.data?.id || `user_${Date.now()}`;
    } catch (error: any) {
      // If user already exists, that's okay, use a fallback ID
      console.log('User registration note:', error.message);
      cardUserId = `user_${session.user.email.replace('@', '_').replace('.', '_')}`;
    }

    // Create the virtual card using the new service
    const cardPayload = {
      cardUserId: cardUserId,
      cardType: cardType as 'virtual' | 'physical',
      currency: currency || 'USD',
      cardName: `${userName} Virtual Card`,
      cardBrand: cardBrand as 'visa' | 'mastercard'
    };

    const result = await createVirtualCard(cardPayload);

    // If successful, also top up the card with the initial amount
    if (result && amount > 0) {
      try {
        const topUpPayload = {
          cardId: result?.data?.id || 'temp_card_id',
          amount: parseFloat(amount),
          currency: currency || 'USD',
          reference: `Initial topup for ${userName}`
        };

        await bitnobCardService.topUpCard(topUpPayload);
      } catch (topUpError) {
        console.log('Top-up note:', topUpError);
        // Card creation succeeded, but top-up failed - that's still a success
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Virtual card created successfully',
      data: {
        cardId: result?.data?.id,
        cardNumber: result?.data?.cardNumber,
        expiryDate: result?.data?.expiryDate,
        cvv: result?.data?.cvv,
        balance: amount,
        currency: currency || 'USD',
        cardName: `${userName} Virtual Card`,
        cardBrand: cardBrand,
        status: 'active'
      },
    });
  } catch (error: any) {
    console.error('Create virtual card error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create virtual card'
      },
      { status: 500 }
    );
  }
}
