import crypto from 'crypto';

/**
 * Bitnob Webhook Verification Utility
 * Handles webhook signature verification and processing
 */
export class BitnobWebhookService {
  private webhookSecret: string;

  constructor() {
    this.webhookSecret = process.env.BITNOB_WEBHOOK_SECRET || '';
    
    if (!this.webhookSecret) {
      throw new Error('BITNOB_WEBHOOK_SECRET environment variable is required');
    }
  }

  /**
   * Verify webhook signature using HMAC-SHA256
   * @param payload - Raw webhook payload
   * @param signature - Webhook signature from headers
   * @returns boolean indicating if signature is valid
   */
  verifySignature(payload: string | Buffer, signature: string): boolean {
    try {
      const hmac = crypto.createHmac('sha256', this.webhookSecret);
      hmac.update(payload);
      const calculatedSignature = hmac.digest('hex');
      
      // Remove 'sha256=' prefix if present
      const cleanSignature = signature.replace('sha256=', '');
      
      // Use timing-safe comparison to prevent timing attacks
      return crypto.timingSafeEqual(
        Buffer.from(calculatedSignature, 'hex'),
        Buffer.from(cleanSignature, 'hex')
      );
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }

  /**
   * Process verified webhook payload
   * @param payload - Parsed webhook payload
   * @returns Promise<void>
   */
  async processWebhook(payload: any): Promise<void> {
    try {
      const { event, data } = payload;
      
      console.log(`📡 Processing webhook event: ${event}`);
      
      switch (event) {
        case 'card.created':
          await this.handleCardCreated(data);
          break;
          
        case 'card.topup':
          await this.handleCardTopup(data);
          break;
          
        case 'card.transaction':
          await this.handleCardTransaction(data);
          break;
          
        case 'card.frozen':
          await this.handleCardFrozen(data);
          break;
          
        case 'card.unfrozen':
          await this.handleCardUnfrozen(data);
          break;
          
        case 'transfer.initiated':
          await this.handleTransferInitiated(data);
          break;
          
        case 'transfer.completed':
          await this.handleTransferCompleted(data);
          break;
          
        case 'transfer.failed':
          await this.handleTransferFailed(data);
          break;
          
        default:
          console.log(`⚠️ Unhandled webhook event: ${event}`);
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }

  private async handleCardCreated(data: any): Promise<void> {
    console.log('💳 Card created:', data);
    // TODO: Update database with new card information
  }

  private async handleCardTopup(data: any): Promise<void> {
    console.log('💰 Card topped up:', data);
    // TODO: Update card balance in database
  }

  private async handleCardTransaction(data: any): Promise<void> {
    console.log('🛒 Card transaction:', data);
    // TODO: Record transaction in database
  }

  private async handleCardFrozen(data: any): Promise<void> {
    console.log('🧊 Card frozen:', data);
    // TODO: Update card status in database
  }

  private async handleCardUnfrozen(data: any): Promise<void> {
    console.log('🔥 Card unfrozen:', data);
    // TODO: Update card status in database
  }

  private async handleTransferInitiated(data: any): Promise<void> {
    console.log('🚀 Transfer initiated:', data);
    // TODO: Update transfer status in database
  }

  private async handleTransferCompleted(data: any): Promise<void> {
    console.log('✅ Transfer completed:', data);
    // TODO: Update transfer status and user balances
  }

  private async handleTransferFailed(data: any): Promise<void> {
    console.log('❌ Transfer failed:', data);
    // TODO: Update transfer status and notify user
  }
}

// Export singleton instance
export const bitnobWebhookService = new BitnobWebhookService();
