import { NextRequest, NextResponse } from 'next/server';
import { bitnobWebhookService } from '@/lib/bitnob-webhook';

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-bitnob-signature') || 
                     request.headers.get('x-signature') || '';

    console.log('📡 Received webhook:', {
      hasSignature: !!signature,
      bodyLength: rawBody.length,
      timestamp: new Date().toISOString()
    });

    // Verify webhook signature
    if (!bitnobWebhookService.verifySignature(rawBody, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse the verified payload
    const payload = JSON.parse(rawBody);

    // Process the webhook
    await bitnobWebhookService.processWebhook(payload);

    console.log('✅ Webhook processed successfully');

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('💥 Webhook processing error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to process webhook',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Bitnob webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
