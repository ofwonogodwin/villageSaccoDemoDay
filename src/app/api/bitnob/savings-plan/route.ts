import { NextRequest, NextResponse } from 'next/server';
import { createBitcoinSavingsPlan } from '@/lib/bitnob';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, frequency, currency, startDate } = body;

    // Validate input
    if (!amount || !frequency || !currency || !startDate) {
      return NextResponse.json(
        { error: 'Amount, frequency, currency, and start date are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
      return NextResponse.json(
        { error: 'Frequency must be daily, weekly, or monthly' },
        { status: 400 }
      );
    }

    // Validate start date
    const start = new Date(startDate);
    if (start < new Date()) {
      return NextResponse.json(
        { error: 'Start date cannot be in the past' },
        { status: 400 }
      );
    }

    // Call Bitnob API to create savings plan
    const result = await createBitcoinSavingsPlan(amount, frequency as any, currency, startDate);

    return NextResponse.json({
      success: true,
      message: 'Bitcoin savings plan created successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Create savings plan error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create savings plan'
      },
      { status: 500 }
    );
  }
}
