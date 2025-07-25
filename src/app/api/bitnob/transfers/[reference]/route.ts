import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { bitnobTransferService } from '@/lib/bitnob-transfer-service';

export async function GET(
    request: NextRequest,
    { params }: { params: { reference: string } }
) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { reference } = params;

        if (!reference) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    message: 'Transaction reference is required'
                },
                { status: 400 }
            );
        }

        console.log(`📊 Getting transfer status for user: ${session.user.email}, reference: ${reference}`);

        // Get transfer status
        const result = await bitnobTransferService.getTransferStatus(reference);

        return NextResponse.json({
            success: true,
            message: 'Transfer status retrieved successfully',
            data: result.data || result
        });

    } catch (error) {
        console.error('❌ Get transfer status API error:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to get transfer status',
                message: errorMessage
            },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { reference: string } }
) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { reference } = params;
        const body = await request.json();
        const { action } = body;

        if (!reference) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    message: 'Transaction reference is required'
                },
                { status: 400 }
            );
        }

        if (action === 'cancel') {
            console.log(`🚫 Cancelling transfer for user: ${session.user.email}, reference: ${reference}`);

            // Cancel transfer
            const result = await bitnobTransferService.cancelTransfer(reference);

            return NextResponse.json({
                success: true,
                message: 'Transfer cancelled successfully',
                data: result.data || result
            });
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Invalid action',
                message: 'Only "cancel" action is supported'
            },
            { status: 400 }
        );

    } catch (error) {
        console.error('❌ Transfer action API error:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            {
                success: false,
                error: 'Transfer action failed',
                message: errorMessage
            },
            { status: 500 }
        );
    }
}
