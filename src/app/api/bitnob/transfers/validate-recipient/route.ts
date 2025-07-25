import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { bitnobTransferService } from '@/lib/bitnob-transfer-service';

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Authentication required',
                    message: 'Please log in to validate recipients'
                },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        console.log('🔍 Validate recipient request from user:', session.user.email);

        // Validate required fields
        const { recipient, currency } = body;

        if (!recipient || !currency) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    message: 'Recipient and currency are required fields'
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

        // Validate recipient format
        if (typeof recipient !== 'string' || recipient.trim().length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid recipient',
                    message: 'Recipient must be a valid email, phone number, or wallet address'
                },
                { status: 400 }
            );
        }

        // Call Bitnob service
        const result = await bitnobTransferService.validateRecipient(recipient.trim(), currency.toUpperCase());

        console.log('✅ Recipient validated successfully for user:', session.user.email);

        return NextResponse.json({
            success: true,
            message: 'Recipient validated successfully',
            data: result.data || result
        });

    } catch (error) {
        console.error('❌ Validate recipient API error:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        // Check if it's a recipient validation error
        if (errorMessage.includes('recipient') || errorMessage.includes('invalid') || errorMessage.includes('not found')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Recipient validation failed',
                    message: errorMessage
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Recipient validation failed',
                message: errorMessage
            },
            { status: 500 }
        );
    }
}
