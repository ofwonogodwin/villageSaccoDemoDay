import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { bitnobTransferService, InitiateTransferPayload } from '@/lib/bitnob-transfer-service';

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Authentication required',
                    message: 'Please log in to initiate transfers'
                },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        console.log('💸 Initiate transfer request from user:', session.user.email);
        console.log('Request payload:', body);

        // Validate required fields
        const { amount, currency, recipient, reason } = body;

        if (!amount || !currency || !recipient) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    message: 'Amount, currency, and recipient are required fields'
                },
                { status: 400 }
            );
        }

        // Validate amount
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid amount',
                    message: 'Amount must be a valid positive number'
                },
                { status: 400 }
            );
        }

        // Validate currency
        const validCurrencies = ['USD', 'BTC', 'EUR', 'GBP', 'NGN'];
        if (!validCurrencies.includes(currency.toUpperCase())) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid currency',
                    message: `Currency must be one of: ${validCurrencies.join(', ')}`
                },
                { status: 400 }
            );
        }

        // Prepare transfer payload
        const transferPayload: InitiateTransferPayload = {
            amount: amount.toString(),
            currency: currency.toUpperCase(),
            recipient,
            ...(reason && { reason })
        };

        // Call Bitnob service
        const result = await bitnobTransferService.initiateTransfer(transferPayload);

        console.log('✅ Transfer initiated successfully for user:', session.user.email);

        return NextResponse.json({
            success: true,
            message: 'Transfer initiated successfully',
            data: result.data
        });

    } catch (error) {
        console.error('❌ Initiate transfer API error:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            {
                success: false,
                error: 'Transfer initiation failed',
                message: errorMessage
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');

        console.log(`📜 Getting transfer history for user: ${session.user.email} (limit: ${limit}, offset: ${offset})`);

        // Get transfer history
        const result = await bitnobTransferService.getTransferHistory(limit, offset);

        return NextResponse.json({
            success: true,
            message: 'Transfer history retrieved successfully',
            data: result.data || result
        });

    } catch (error) {
        console.error('❌ Get transfer history API error:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to get transfer history',
                message: errorMessage
            },
            { status: 500 }
        );
    }
}
