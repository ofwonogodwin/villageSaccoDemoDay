import axios, { AxiosInstance, AxiosResponse } from 'axios';
import crypto from 'crypto';

export interface BitnobConfig {
  clientId: string;
  secretKey: string;
  baseUrl: string;
}

export interface BitcoinSavingsPlan {
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  currency: string;
  startDate: string;
}

export interface SendMoneyRequest {
  receiver: string;
  amount: number;
  currency: string;
  description?: string;
}

export interface SwapCurrencyRequest {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

export interface VirtualCardRequest {
  userName: string;
  amount: number;
  currency?: string;
}

class BitnobAPI {
  private client: AxiosInstance;
  private config: BitnobConfig;

  constructor(config: BitnobConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: 30000,
    });
  }

  /**
   * Generate HMAC-SHA512 signature for Bitnob API authentication
   */
  private generateSignature(payload: string, timestamp: string): string {
    const data = timestamp + payload;
    return crypto
      .createHmac('sha512', this.config.secretKey)
      .update(data)
      .digest('hex');
  }

  /**
   * Get current timestamp
   */
  private getTimestamp(): string {
    return Math.floor(Date.now() / 1000).toString();
  }

  /**
   * Make authenticated request to Bitnob API
   */
  private async makeRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any
  ): Promise<AxiosResponse> {
    try {
      const timestamp = this.getTimestamp();
      const payload = data ? JSON.stringify(data) : '';
      const signature = this.generateSignature(payload, timestamp);

      const headers = {
        'Content-Type': 'application/json',
        'clientid': this.config.clientId,
        'signature': signature,
        'timestamp': timestamp,
      };

      console.log(`🚀 Making ${method} request to: ${endpoint}`);
      console.log('📤 Headers:', headers);
      console.log('📤 Payload:', data);

      const response = await this.client.request({
        method,
        url: endpoint,
        data,
        headers,
      });

      console.log('📥 Response:', response.data);
      return response;
    } catch (error: any) {
      console.error('❌ Bitnob API Error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Bitnob API request failed'
      );
    }
  }

  /**
   * Create a virtual dollar card
   */
  async createVirtualCard(request: VirtualCardRequest): Promise<any> {
    try {
      const payload = {
        userName: request.userName,
        amount: request.amount,
        currency: request.currency || 'USD',
        cardType: 'virtual',
      };

      const response = await this.makeRequest('POST', '/api/v1/virtual-cards/create', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating virtual card:', error);
      throw error;
    }
  }

  /**
   * Create a Bitcoin savings plan
   */
  async createBitcoinSavingsPlan(plan: BitcoinSavingsPlan): Promise<any> {
    try {
      const payload = {
        amount: plan.amount,
        frequency: plan.frequency,
        currency: plan.currency,
        startDate: plan.startDate,
        planType: 'bitcoin_savings',
      };

      const response = await this.makeRequest('POST', '/savings/bitcoin', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating Bitcoin savings plan:', error);
      throw error;
    }
  }

  /**
   * Send money to another user
   */
  async sendMoney(request: SendMoneyRequest): Promise<any> {
    try {
      const payload = {
        receiver: request.receiver,
        amount: request.amount,
        currency: request.currency,
        description: request.description || 'SACCO Transfer',
        type: 'send_money',
      };

      const response = await this.makeRequest('POST', '/wallets/send', payload);
      return response.data;
    } catch (error) {
      console.error('Error sending money:', error);
      throw error;
    }
  }

  /**
   * Swap between currencies
   */
  async swapCurrency(request: SwapCurrencyRequest): Promise<any> {
    try {
      const payload = {
        fromCurrency: request.fromCurrency,
        toCurrency: request.toCurrency,
        amount: request.amount,
        swapType: 'instant',
      };

      const response = await this.makeRequest('POST', '/swap', payload);
      return response.data;
    } catch (error) {
      console.error('Error swapping currency:', error);
      throw error;
    }
  }

  /**
   * Get user wallet balance
   */
  async getWalletBalance(): Promise<any> {
    try {
      const response = await this.makeRequest('GET', '/wallets/balance');
      return response.data;
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(limit: number = 50): Promise<any> {
    try {
      const response = await this.makeRequest('GET', `/transactions?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw error;
    }
  }

  /**
   * Get user virtual cards
   */
  async getVirtualCards(): Promise<any> {
    try {
      const response = await this.makeRequest('GET', '/api/v1/virtual-cards/cards');
      return response.data;
    } catch (error) {
      console.error('Error getting virtual cards:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const bitnobConfig: BitnobConfig = {
  clientId: process.env.BITNOB_CLIENT_ID || '',
  secretKey: process.env.BITNOB_SECRET_KEY || '',
  baseUrl: process.env.BITNOB_BASE_URL || 'https://sandboxapi.bitnob.co/api/v1',
};

export const bitnobAPI = new BitnobAPI(bitnobConfig);

// Export helper functions for easy use
export const createVirtualCard = (userName: string, amount: number, currency?: string) =>
  bitnobAPI.createVirtualCard({ userName, amount, currency });

export const createBitcoinSavingsPlan = (
  amount: number,
  frequency: 'daily' | 'weekly' | 'monthly',
  currency: string,
  startDate: string
) => bitnobAPI.createBitcoinSavingsPlan({ amount, frequency, currency, startDate });

export const sendMoney = (receiver: string, amount: number, currency: string, description?: string) =>
  bitnobAPI.sendMoney({ receiver, amount, currency, description });

export const swapCurrency = (fromCurrency: string, toCurrency: string, amount: number) =>
  bitnobAPI.swapCurrency({ fromCurrency, toCurrency, amount });

export default BitnobAPI;
