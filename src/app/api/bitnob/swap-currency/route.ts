import { NextRequest, NextResponse } from 'next/server';
import { swapCurrency } from '@/lib/bitnob';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromCurrency, toCurrency, amount } = body;

    // Validate input
    if (!fromCurrency || !toCurrency || !amount) {
      return NextResponse.json(
        { error: 'From currency, to currency, and amount are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    if (fromCurrency === toCurrency) {
      return NextResponse.json(
        { error: 'From and to currencies cannot be the same' },
        { status: 400 }
      );
    }

    // Supported currencies (can be expanded)
    const supportedCurrencies = ['USD', 'BTC', 'NGN', 'EUR', 'GBP'];
    if (!supportedCurrencies.includes(fromCurrency) || !supportedCurrencies.includes(toCurrency)) {
      return NextResponse.json(
        { error: `Supported currencies are: ${supportedCurrencies.join(', ')}` },
        { status: 400 }
      );
    }

    // Call Bitnob API to swap currency
    const result = await swapCurrency(fromCurrency, toCurrency, amount);

    return NextResponse.json({
      success: true,
      message: 'Currency swap completed successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Currency swap error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to swap currency'
      },
      { status: 500 }
    );
  }
}
