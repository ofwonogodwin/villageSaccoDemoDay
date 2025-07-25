import axios, { AxiosInstance, AxiosResponse } from 'axios';

/**
 * Interface for transfer initiation payload
 */
export interface InitiateTransferPayload {
    amount: string;
    currency: string;
    recipient: string;
    reason?: string;
}

/**
 * Interface for transfer finalization payload
 */
export interface FinalizeTransferPayload {
    transactionReference: string;
    otp: string;
}

/**
 * Interface for transfer initiation response
 */
export interface InitiateTransferResponse {
    success: boolean;
    message: string;
    data: {
        transactionReference: string;
        amount: string;
        currency: string;
        recipient: string;
        status: string;
        requiresOtp: boolean;
        estimatedFee: string;
        createdAt: string;
    };
}

/**
 * Interface for transfer finalization response
 */
export interface FinalizeTransferResponse {
    success: boolean;
    message: string;
    data: {
        transactionReference: string;
        status: string;
        finalAmount: string;
        completedAt: string;
        transactionHash?: string;
    };
}

/**
 * BitnobTransferService class for handling money transfers
 * Provides methods to initiate and finalize transfers using Bitnob API
 */
class BitnobTransferService {
    private axiosInstance: AxiosInstance;
    private baseUrl: string;
    private secretKey: string;

    constructor() {
        // Read environment variables
        this.baseUrl = process.env.BITNOB_BASE_URL || '';
        this.secretKey = process.env.BITNOB_SECRET_KEY || '';

        if (!this.baseUrl) {
            throw new Error('BITNOB_BASE_URL environment variable is required');
        }

        if (!this.secretKey) {
            throw new Error('BITNOB_SECRET_KEY environment variable is required');
        }

        // Create axios instance with default configuration
        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Authorization': `Bearer ${this.secretKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 30000 // 30 seconds timeout
        });

        // Add request interceptor for logging
        this.axiosInstance.interceptors.request.use(
            (config) => {
                console.log(`🚀 Bitnob Transfer API Request: ${config.method?.toUpperCase()} ${config.url}`);
                console.log('Request payload:', config.data);
                return config;
            },
            (error) => {
                console.error('❌ Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // Add response interceptor for logging
        this.axiosInstance.interceptors.response.use(
            (response) => {
                console.log(`✅ Bitnob Transfer API Response: ${response.status} ${response.statusText}`);
                console.log('Response data:', response.data);
                return response;
            },
            (error) => {
                console.error('❌ Response interceptor error:', error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    /**
     * Initiate a money transfer
     * @param payload - Transfer details including amount, currency, recipient, and optional reason
     * @returns Promise resolving to transfer initiation response
     */
    async initiateTransfer(payload: InitiateTransferPayload): Promise<InitiateTransferResponse> {
        try {
            console.log('💸 Initiating transfer with payload:', payload);

            // Validate required fields
            if (!payload.amount || !payload.currency || !payload.recipient) {
                throw new Error('Amount, currency, and recipient are required fields');
            }

            // Validate amount is a positive number
            const amount = parseFloat(payload.amount);
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Amount must be a valid positive number');
            }

            // Prepare request payload
            const requestPayload = {
                amount: payload.amount,
                currency: payload.currency.toUpperCase(),
                recipient: payload.recipient,
                ...(payload.reason && { reason: payload.reason })
            };

            // Make API request
            const response: AxiosResponse<InitiateTransferResponse> = await this.axiosInstance.post(
                '/api/v1/transfers',
                requestPayload
            );

            console.log('✅ Transfer initiated successfully:', response.data);
            return response.data;

        } catch (error) {
            console.error('❌ Failed to initiate transfer:', error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                const statusCode = error.response?.status || 500;

                throw new Error(`Transfer initiation failed (${statusCode}): ${errorMessage}`);
            }

            throw new Error(`Transfer initiation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Finalize a money transfer using OTP
     * @param payload - Transaction reference and OTP for confirmation
     * @returns Promise resolving to transfer finalization response
     */
    async finalizeTransfer(payload: FinalizeTransferPayload): Promise<FinalizeTransferResponse> {
        try {
            console.log('🔐 Finalizing transfer with reference:', payload.transactionReference);

            // Validate required fields
            if (!payload.transactionReference || !payload.otp) {
                throw new Error('Transaction reference and OTP are required fields');
            }

            // Validate OTP format (assuming 6-digit OTP)
            if (!/^\d{6}$/.test(payload.otp)) {
                throw new Error('OTP must be a 6-digit number');
            }

            // Prepare request payload
            const requestPayload = {
                transactionReference: payload.transactionReference,
                otp: payload.otp
            };

            // Make API request
            const response: AxiosResponse<FinalizeTransferResponse> = await this.axiosInstance.post(
                '/api/v1/transfers/finalize',
                requestPayload
            );

            console.log('✅ Transfer finalized successfully:', response.data);
            return response.data;

        } catch (error) {
            console.error('❌ Failed to finalize transfer:', error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                const statusCode = error.response?.status || 500;

                throw new Error(`Transfer finalization failed (${statusCode}): ${errorMessage}`);
            }

            throw new Error(`Transfer finalization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get transfer status by transaction reference
     * @param transactionReference - The transaction reference to check
     * @returns Promise resolving to transfer status
     */
    async getTransferStatus(transactionReference: string): Promise<any> {
        try {
            console.log('📊 Getting transfer status for:', transactionReference);

            if (!transactionReference) {
                throw new Error('Transaction reference is required');
            }

            const response: AxiosResponse = await this.axiosInstance.get(
                `/api/v1/transfers/${transactionReference}`
            );

            console.log('✅ Transfer status retrieved:', response.data);
            return response.data;

        } catch (error) {
            console.error('❌ Failed to get transfer status:', error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                const statusCode = error.response?.status || 500;

                throw new Error(`Get transfer status failed (${statusCode}): ${errorMessage}`);
            }

            throw new Error(`Get transfer status failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get user's transfer history
     * @param limit - Number of transfers to retrieve (default: 10)
     * @param offset - Number of transfers to skip (default: 0)
     * @returns Promise resolving to transfer history
     */
    async getTransferHistory(limit: number = 10, offset: number = 0): Promise<any> {
        try {
            console.log(`📜 Getting transfer history (limit: ${limit}, offset: ${offset})`);

            const response: AxiosResponse = await this.axiosInstance.get(
                `/api/v1/transfers?limit=${limit}&offset=${offset}`
            );

            console.log('✅ Transfer history retrieved:', response.data);
            return response.data;

        } catch (error) {
            console.error('❌ Failed to get transfer history:', error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                const statusCode = error.response?.status || 500;

                throw new Error(`Get transfer history failed (${statusCode}): ${errorMessage}`);
            }

            throw new Error(`Get transfer history failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Cancel a pending transfer
     * @param transactionReference - The transaction reference to cancel
     * @returns Promise resolving to cancellation response
     */
    async cancelTransfer(transactionReference: string): Promise<any> {
        try {
            console.log('🚫 Cancelling transfer:', transactionReference);

            if (!transactionReference) {
                throw new Error('Transaction reference is required');
            }

            const response: AxiosResponse = await this.axiosInstance.post(
                `/api/v1/transfers/${transactionReference}/cancel`
            );

            console.log('✅ Transfer cancelled successfully:', response.data);
            return response.data;

        } catch (error) {
            console.error('❌ Failed to cancel transfer:', error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                const statusCode = error.response?.status || 500;

                throw new Error(`Cancel transfer failed (${statusCode}): ${errorMessage}`);
            }

            throw new Error(`Cancel transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Validate recipient details before transfer
     * @param recipient - Recipient identifier (email, phone, or wallet address)
     * @param currency - Transfer currency
     * @returns Promise resolving to recipient validation response
     */
    async validateRecipient(recipient: string, currency: string): Promise<any> {
        try {
            console.log('🔍 Validating recipient:', recipient);

            if (!recipient || !currency) {
                throw new Error('Recipient and currency are required');
            }

            const response: AxiosResponse = await this.axiosInstance.post(
                '/api/v1/transfers/validate-recipient',
                {
                    recipient,
                    currency: currency.toUpperCase()
                }
            );

            console.log('✅ Recipient validated:', response.data);
            return response.data;

        } catch (error) {
            console.error('❌ Failed to validate recipient:', error);

            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                const statusCode = error.response?.status || 500;

                throw new Error(`Recipient validation failed (${statusCode}): ${errorMessage}`);
            }

            throw new Error(`Recipient validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

// Export singleton instance
export const bitnobTransferService = new BitnobTransferService();

// Export class for testing or multiple instances
export { BitnobTransferService };
