import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { bitnobTransferService, FinalizeTransferPayload } from '@/lib/bitnob-transfer-service';

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Authentication required',
                    message: 'Please log in to finalize transfers'
                },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        console.log('🔐 Finalize transfer request from user:', session.user.email);
        console.log('Request payload:', { transactionReference: body.transactionReference });

        // Validate required fields
        const { transactionReference, otp } = body;

        if (!transactionReference || !otp) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    message: 'Transaction reference and OTP are required fields'
                },
                { status: 400 }
            );
        }

        // Validate OTP format
        if (!/^\d{6}$/.test(otp)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid OTP format',
                    message: 'OTP must be a 6-digit number'
                },
                { status: 400 }
            );
        }

        // Prepare finalization payload
        const finalizePayload: FinalizeTransferPayload = {
            transactionReference,
            otp
        };

        // Call Bitnob service
        const result = await bitnobTransferService.finalizeTransfer(finalizePayload);

        console.log('✅ Transfer finalized successfully for user:', session.user.email);

        return NextResponse.json({
            success: true,
            message: 'Transfer completed successfully',
            data: result.data
        });

    } catch (error) {
        console.error('❌ Finalize transfer API error:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        // Check if it's an OTP-related error
        if (errorMessage.includes('OTP') || errorMessage.includes('invalid') || errorMessage.includes('expired')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'OTP verification failed',
                    message: errorMessage
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Transfer finalization failed',
                message: errorMessage
            },
            { status: 500 }
        );
    }
}
