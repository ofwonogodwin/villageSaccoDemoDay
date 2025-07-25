import axios, { AxiosInstance, AxiosResponse } from 'axios';

/**
 * Lightning Payment Payload Interface
 */
export interface LightningPaymentPayload {
  amount: number; // Amount in satoshis
  description?: string;
  destinationAddress?: string; // Lightning address or invoice
}

/**
 * Lightning Invoice Payload Interface
 */
export interface LightningInvoicePayload {
  amount: number; // Amount in satoshis
  description: string;
  expiry?: number; // Expiry time in seconds (default: 3600)
}

/**
 * Bitnob Lightning Network Service
 * Handles Lightning Network operations with the Bitnob API
 */
export class BitnobLightningService {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;
  private lightningKey: string;

  constructor() {
    this.baseUrl = process.env.BITNOB_BASE_URL || '';
    this.lightningKey = process.env.BITNOB_LIGHTNING_KEY || '';

    if (!this.baseUrl) {
      throw new Error('BITNOB_BASE_URL environment variable is required');
    }

    if (!this.lightningKey) {
      throw new Error('BITNOB_LIGHTNING_KEY environment variable is required');
    }

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.lightningKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`⚡ Lightning API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('⚡ Lightning API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`⚡ Lightning API Response: ${response.status} ${response.statusText}`);
        return response;
      },
      (error) => {
        console.error('⚡ Lightning API Response Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Create a Lightning invoice
   * @param payload - Invoice creation payload
   * @returns Promise<AxiosResponse<any>>
   */
  async createInvoice(payload: LightningInvoicePayload): Promise<AxiosResponse<any>> {
    try {
      console.log('⚡ Creating Lightning invoice:', payload);

      const response = await this.axiosInstance.post('/api/v1/lightning/invoice', {
        amount: payload.amount,
        description: payload.description,
        expiry: payload.expiry || 3600
      });

      console.log('✅ Lightning invoice created successfully');
      return response;

    } catch (error: any) {
      console.error('❌ Failed to create Lightning invoice:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Pay a Lightning invoice
   * @param invoice - Lightning invoice string
   * @returns Promise<AxiosResponse<any>>
   */
  async payInvoice(invoice: string): Promise<AxiosResponse<any>> {
    try {
      console.log('⚡ Paying Lightning invoice');

      const response = await this.axiosInstance.post('/api/v1/lightning/pay', {
        invoice: invoice
      });

      console.log('✅ Lightning payment sent successfully');
      return response;

    } catch (error: any) {
      console.error('❌ Failed to pay Lightning invoice:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get Lightning wallet balance
   * @returns Promise<AxiosResponse<any>>
   */
  async getBalance(): Promise<AxiosResponse<any>> {
    try {
      console.log('⚡ Getting Lightning wallet balance');

      const response = await this.axiosInstance.get('/api/v1/lightning/balance');

      console.log('✅ Lightning balance retrieved successfully');
      return response;

    } catch (error: any) {
      console.error('❌ Failed to get Lightning balance:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get Lightning transaction history
   * @param limit - Number of transactions to retrieve (default: 50)
   * @returns Promise<AxiosResponse<any>>
   */
  async getTransactionHistory(limit: number = 50): Promise<AxiosResponse<any>> {
    try {
      console.log('⚡ Getting Lightning transaction history');

      const response = await this.axiosInstance.get('/api/v1/lightning/transactions', {
        params: { limit }
      });

      console.log('✅ Lightning transaction history retrieved successfully');
      return response;

    } catch (error: any) {
      console.error('❌ Failed to get Lightning transaction history:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Decode a Lightning invoice
   * @param invoice - Lightning invoice string
   * @returns Promise<AxiosResponse<any>>
   */
  async decodeInvoice(invoice: string): Promise<AxiosResponse<any>> {
    try {
      console.log('⚡ Decoding Lightning invoice');

      const response = await this.axiosInstance.post('/api/v1/lightning/decode', {
        invoice: invoice
      });

      console.log('✅ Lightning invoice decoded successfully');
      return response;

    } catch (error: any) {
      console.error('❌ Failed to decode Lightning invoice:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send Lightning payment to address
   * @param payload - Payment payload
   * @returns Promise<AxiosResponse<any>>
   */
  async sendPayment(payload: LightningPaymentPayload): Promise<AxiosResponse<any>> {
    try {
      console.log('⚡ Sending Lightning payment:', payload);

      const response = await this.axiosInstance.post('/api/v1/lightning/send', {
        amount: payload.amount,
        description: payload.description,
        destinationAddress: payload.destinationAddress
      });

      console.log('✅ Lightning payment sent successfully');
      return response;

    } catch (error: any) {
      console.error('❌ Failed to send Lightning payment:', error.response?.data || error.message);
      throw error;
    }
  }
}

// Export singleton instance
export const bitnobLightningService = new BitnobLightningService();
