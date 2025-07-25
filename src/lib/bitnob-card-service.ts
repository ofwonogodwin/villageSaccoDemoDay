import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface BitnobCardConfig {
  baseUrl: string;
  secretKey: string;
}

export interface RegisterCardUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  idType: string;
  idNumber: string;
}

export interface UpdateCardUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

export interface CreateCardPayload {
  cardUserId: string;
  cardType: 'virtual' | 'physical';
  currency: string;
  cardName: string;
  cardBrand: 'visa' | 'mastercard';
}

export interface TopUpCardPayload {
  cardId: string;
  amount: number;
  currency: string;
  reference?: string;
}

export interface WithdrawPayload {
  cardId: string;
  amount: number;
  currency: string;
  reference?: string;
}

export interface FreezeCardPayload {
  cardId: string;
  reason?: string;
}

export interface UnfreezeCardPayload {
  cardId: string;
  reason?: string;
}

export interface MockTransactionPayload {
  cardId: string;
  amount: number;
  currency: string;
  merchantName: string;
  transactionType: 'purchase' | 'withdrawal';
}

export interface TerminateCardPayload {
  cardId: string;
  reason?: string;
}

export interface EnableAirlinesPayload {
  cardId: string;
  enable: boolean;
}

/**
 * Bitnob Virtual Card Service
 * Handles all virtual card operations with the Bitnob API
 */
export class BitnobVirtualCardService {
  private axiosInstance: AxiosInstance;
  private config: BitnobCardConfig;

  constructor(config?: BitnobCardConfig) {
    this.config = config || {
      baseUrl: process.env.BITNOB_BASE_URL || 'https://sandboxapi.bitnob.co',
      secretKey: process.env.BITNOB_SECRET_KEY || '',
    };

    if (!this.config.secretKey) {
      throw new Error('BITNOB_SECRET_KEY is required');
    }

    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.secretKey}`,
        'Accept': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`🔗 Bitnob Card API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('🚨 Bitnob Card API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ Bitnob Card API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('💥 Bitnob Card API Response Error:', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Register a new card user
   */
  async registerCardUser(payload: RegisterCardUserPayload): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(
        '/api/v1/virtual-cards/registercarduser',
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error('Error registering card user:', error);
      throw error;
    }
  }

  /**
   * Update an existing card user
   */
  async updateCardUser(cardUserId: string, payload: UpdateCardUserPayload): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.put(
        `/api/v1/virtual-cards/users/${cardUserId}`,
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error('Error updating card user:', error);
      throw error;
    }
  }

  /**
   * Create a new virtual card
   */
  async createCard(payload: CreateCardPayload): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(
        '/api/v1/virtual-cards/create',
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating virtual card:', error);
      throw error;
    }
  }

  /**
   * Top up a virtual card
   */
  async topUpCard(payload: TopUpCardPayload): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(
        '/api/v1/virtual-cards/topup',
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error('Error topping up card:', error);
      throw error;
    }
  }

  /**
   * Get all virtual cards
   */
  async getAllCards(): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(
        '/api/v1/virtual-cards/cards'
      );
      return response.data;
    } catch (error: any) {
      console.error('Error getting all cards:', error);
      throw error;
    }
  }

  /**
   * Get all card users
   */
  async getAllCardUsers(): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(
        '/api/v1/virtual-cards/users'
      );
      return response.data;
    } catch (error: any) {
      console.error('Error getting all card users:', error);
      throw error;
    }
  }

  /**
   * Get a specific card user by ID
   */
  async getCardUser(cardUserId: string): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(
        `/api/v1/virtual-cards/users/${cardUserId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error getting card user:', error);
      throw error;
    }
  }

  /**
   * Get a specific card by ID
   */
  async getCard(cardId: string): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(
        `/api/v1/virtual-cards/cards/${cardId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error getting card:', error);
      throw error;
    }
  }

  /**
   * Get transactions for a specific card
   */
  async getCardTransactions(cardId: string): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(
        `/api/v1/virtual-cards/cards/${cardId}/transactions`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error getting card transactions:', error);
      throw error;
    }
  }

  /**
   * Get all card transactions
   */
  async getAllCardTransactions(): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(
        '/api/v1/virtual-cards/cards/transactions'
      );
      return response.data;
    } catch (error: any) {
      console.error('Error getting all card transactions:', error);
      throw error;
    }
  }

  /**
   * Withdraw funds from a virtual card
   */
  async withdrawFromCard(payload: WithdrawPayload): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(
        '/api/v1/virtual-cards/withdraw',
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error('Error withdrawing from card:', error);
      throw error;
    }
  }

  /**
   * Freeze a virtual card
   */
  async freezeCard(payload: FreezeCardPayload): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(
        '/api/v1/virtual-cards/freeze',
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error('Error freezing card:', error);
      throw error;
    }
  }

  /**
   * Unfreeze a virtual card
   */
  async unfreezeCard(payload: UnfreezeCardPayload): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(
        '/api/v1/virtual-cards/unfreeze',
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error('Error unfreezing card:', error);
      throw error;
    }
  }

  /**
   * Create a mock transaction for testing
   */
  async createMockTransaction(payload: MockTransactionPayload): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(
        '/api/v1/virtual-cards/mock-transaction',
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error('Error creating mock transaction:', error);
      throw error;
    }
  }

  /**
   * Terminate a virtual card
   */
  async terminateCard(payload: TerminateCardPayload): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(
        '/api/v1/virtual-cards/terminate',
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error('Error terminating card:', error);
      throw error;
    }
  }

  /**
   * Enable or disable airline transactions for a card
   */
  async enableAirlines(cardId: string, payload: EnableAirlinesPayload): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.put(
        '/api/v1/virtual-cards/enable-airlines',
        { ...payload, cardId }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error enabling/disabling airlines:', error);
      throw error;
    }
  }

  /**
   * Utility method to check service health
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.getAllCardUsers();
      return true;
    } catch (error) {
      console.error('Bitnob Card Service health check failed:', error);
      return false;
    }
  }
}

// Create and export singleton instance
const bitnobCardConfig: BitnobCardConfig = {
  baseUrl: process.env.BITNOB_BASE_URL || 'https://sandboxapi.bitnob.co',
  secretKey: process.env.BITNOB_SECRET_KEY || '',
};

export const bitnobCardService = new BitnobVirtualCardService(bitnobCardConfig);

// Export helper functions for common operations
export const registerCardUser = (payload: RegisterCardUserPayload) =>
  bitnobCardService.registerCardUser(payload);

export const createVirtualCard = (payload: CreateCardPayload) =>
  bitnobCardService.createCard(payload);

export const topUpVirtualCard = (payload: TopUpCardPayload) =>
  bitnobCardService.topUpCard(payload);

export const getVirtualCard = (cardId: string) =>
  bitnobCardService.getCard(cardId);

export const freezeVirtualCard = (payload: FreezeCardPayload) =>
  bitnobCardService.freezeCard(payload);

export const unfreezeVirtualCard = (payload: UnfreezeCardPayload) =>
  bitnobCardService.unfreezeCard(payload);

export default BitnobVirtualCardService;
