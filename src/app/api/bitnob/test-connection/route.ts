import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { bitnobCardService } from '@/lib/bitnob-card-service'
import { bitnobTransferService } from '@/lib/bitnob-transfer-service'
import { bitnobWebhookService } from '@/lib/bitnob-webhook'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Comprehensive configuration check
    const configCheck = {
      // Environment variables
      hasBaseUrl: !!process.env.BITNOB_BASE_URL,
      hasSecretKey: !!process.env.BITNOB_SECRET_KEY,
      hasLightningKey: !!process.env.BITNOB_LIGHTNING_KEY,
      hasHmacPublicKey: !!process.env.BITNOB_HMAC_PUBLIC_KEY,
      hasWebhookSecret: !!process.env.BITNOB_WEBHOOK_SECRET,
      hasClientId: !!process.env.BITNOB_CLIENT_ID,

      // Service initialization
      cardServiceInitialized: !!bitnobCardService,
      transferServiceInitialized: !!bitnobTransferService,
      webhookServiceInitialized: !!bitnobWebhookService,

      // API configuration
      baseUrl: process.env.BITNOB_BASE_URL,
      environment: process.env.NODE_ENV
    }

    return NextResponse.json({
      success: true,
      message: 'Bitnob service configuration test completed',
      data: {
        user: session.user.email,
        timestamp: new Date().toISOString(),
        configuration: configCheck,
        status: {
          ready: configCheck.hasBaseUrl && configCheck.hasSecretKey &&
            configCheck.cardServiceInitialized && configCheck.transferServiceInitialized,
          missingCredentials: [
            !configCheck.hasBaseUrl && 'BITNOB_BASE_URL',
            !configCheck.hasSecretKey && 'BITNOB_SECRET_KEY',
            !configCheck.hasLightningKey && 'BITNOB_LIGHTNING_KEY',
            !configCheck.hasHmacPublicKey && 'BITNOB_HMAC_PUBLIC_KEY',
            !configCheck.hasWebhookSecret && 'BITNOB_WEBHOOK_SECRET',
            !configCheck.hasClientId && 'BITNOB_CLIENT_ID'
          ].filter(Boolean)
        }
      }
    })

  } catch (error) {
    console.error('Test connection error:', error)

    return NextResponse.json({
      success: false,
      error: 'Failed to test connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'validateEnvironment':
        return NextResponse.json({
          success: true,
          data: {
            hasBaseUrl: !!process.env.BITNOB_BASE_URL,
            hasSecretKey: !!process.env.BITNOB_SECRET_KEY,
            baseUrl: process.env.BITNOB_BASE_URL ? 'Configured' : 'Missing',
            secretKey: process.env.BITNOB_SECRET_KEY ? 'Configured' : 'Missing'
          }
        })

      case 'listEndpoints':
        return NextResponse.json({
          success: true,
          data: {
            availableEndpoints: [
              'POST /api/bitnob/create-card - Create a new virtual card',
              'POST /api/bitnob/topup-card - Top up an existing card',
              'GET /api/bitnob/get-cards - Get all user cards',
              'POST /api/bitnob/manage-card - Freeze/unfreeze a card',
              'GET /api/bitnob/test-connection - Test service connection'
            ]
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Test endpoint error:', error)

    return NextResponse.json({
      success: false,
      error: 'Test endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
