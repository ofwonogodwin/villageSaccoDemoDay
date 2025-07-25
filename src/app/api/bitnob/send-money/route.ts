import { NextRequest, NextResponse } from 'next/server';
import { sendMoney } from '@/lib/bitnob';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { receiver, amount, currency, description } = body;

    // Validate input
    if (!receiver || !amount || !currency) {
      return NextResponse.json(
        { error: 'Receiver, amount, and currency are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate receiver format (email or BTC address)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/;

    if (!emailRegex.test(receiver) && !btcRegex.test(receiver)) {
      return NextResponse.json(
        { error: 'Receiver must be a valid email address or Bitcoin address' },
        { status: 400 }
      );
    }

    // Call Bitnob API to send money
    const result = await sendMoney(receiver, amount, currency, description);

    return NextResponse.json({
      success: true,
      message: 'Money sent successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Send money error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send money'
      },
      { status: 500 }
    );
  }
}
