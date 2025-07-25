const axios = require("axios");
require("dotenv").config();

const BITNOB_BASE_URL = process.env.BITNOB_BASE_URL;
const BITNOB_SECRET_KEY = process.env.BITNOB_SECRET_KEY;

if (!BITNOB_BASE_URL || !BITNOB_SECRET_KEY) {
    throw new Error("Missing required environment variables: BITNOB_BASE_URL and BITNOB_SECRET_KEY");
}

const headers = {
    Authorization: `Bearer ${BITNOB_SECRET_KEY}`,
    "Content-Type": "application/json"
};

/**
 * Enhanced Bitnob Service with Mock Mode for Development
 */
class BitnobService {
    constructor(options = {}) {
        this.useMockMode = options.useMockMode || false;
        this.mockCards = [];
        this.mockTransactions = [];
    }

    /**
     * Generate mock card data for development
     */
    generateMockCard(userName, amount, currency = "USD") {
        const cardId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
            id: cardId,
            cardId: cardId,
            userName: userName,
            maskedCardNumber: "4532 **** **** 1234",
            cardBrand: "VISA",
            balance: amount,
            currency: currency,
            status: "active",
            expiryDate: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)).toISOString(), // 1 year from now
            cardType: "virtual",
            createdAt: new Date().toISOString(),
            cvv: "***",
            isActive: true
        };
    }

    /**
     * Create a virtual card
     */
    async createVirtualCard(userName, amount, currency = "USD") {
        const payload = {
            currency,
            amount,
            userName,
            reference: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        // Mock mode for development
        if (this.useMockMode) {
            console.log(`🧪 MOCK MODE: Creating virtual card for ${userName} with ${currency} ${amount}`);
            const mockCard = this.generateMockCard(userName, amount, currency);
            this.mockCards.push(mockCard);

            return {
                success: true,
                data: mockCard,
                message: "Virtual card created successfully (Mock Mode)"
            };
        }

        try {
            console.log(`🏦 Creating virtual card for ${userName} with ${currency} ${amount}`);

            const response = await axios.post(
                `${BITNOB_BASE_URL}/api/v1/cards/create`,
                payload,
                { headers }
            );

            console.log("✅ Card Created Successfully:", response.data);
            return {
                success: true,
                data: response.data,
                message: "Virtual card created successfully"
            };
        } catch (error) {
            console.error("❌ Error creating card:", error.response?.data || error.message);

            // If API is not available, suggest mock mode
            if (error.response?.status === 404) {
                console.log("💡 Suggestion: Use mock mode for development by setting useMockMode: true");
            }

            return {
                success: false,
                error: error.response?.data || error.message,
                message: "Failed to create virtual card",
                suggestion: "Consider using mock mode for development"
            };
        }
    }

    /**
     * Get all virtual cards
     */
    async getAllCards() {
        // Mock mode
        if (this.useMockMode) {
            console.log("🧪 MOCK MODE: Fetching all virtual cards");
            return {
                success: true,
                data: { cards: this.mockCards },
                message: "Cards retrieved successfully (Mock Mode)"
            };
        }

        try {
            console.log("📋 Fetching all virtual cards...");

            const response = await axios.get(
                `${BITNOB_BASE_URL}/api/v1/cards`,
                { headers }
            );

            console.log("✅ Cards retrieved successfully");
            return {
                success: true,
                data: response.data,
                message: "Cards retrieved successfully"
            };
        } catch (error) {
            console.error("❌ Error fetching cards:", error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || error.message,
                message: "Failed to fetch cards"
            };
        }
    }

    /**
     * Top up a virtual card
     */
    async topUpCard(cardId, amount, currency = "USD") {
        const payload = {
            cardId,
            amount,
            currency,
            reference: `topup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        // Mock mode
        if (this.useMockMode) {
            console.log(`🧪 MOCK MODE: Topping up card ${cardId} with ${currency} ${amount}`);
            const card = this.mockCards.find(c => c.id === cardId || c.cardId === cardId);
            if (card) {
                card.balance += amount;
                return {
                    success: true,
                    data: { cardId, amount, currency, newBalance: card.balance },
                    message: "Card topped up successfully (Mock Mode)"
                };
            } else {
                return {
                    success: false,
                    error: "Card not found",
                    message: "Card not found in mock data"
                };
            }
        }

        try {
            console.log(`💰 Topping up card ${cardId} with ${currency} ${amount}`);

            const response = await axios.post(
                `${BITNOB_BASE_URL}/api/v1/cards/topup`,
                payload,
                { headers }
            );

            console.log("✅ Card topped up successfully:", response.data);
            return {
                success: true,
                data: response.data,
                message: "Card topped up successfully"
            };
        } catch (error) {
            console.error("❌ Error topping up card:", error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || error.message,
                message: "Failed to top up card"
            };
        }
    }

    /**
     * Test connection with fallback to mock mode
     */
    async testConnection() {
        if (this.useMockMode) {
            console.log("🧪 MOCK MODE: Connection test");
            return {
                success: true,
                data: {
                    baseUrl: "Mock Mode",
                    status: "Connected (Mock)",
                    timestamp: new Date().toISOString(),
                    mockCards: this.mockCards.length
                },
                message: "Mock mode connection successful"
            };
        }

        try {
            console.log("🔗 Testing Bitnob API connection...");

            const response = await axios.get(
                `${BITNOB_BASE_URL}/api/v1/cards`,
                { headers }
            );

            console.log("✅ Connection test successful");
            return {
                success: true,
                data: {
                    baseUrl: BITNOB_BASE_URL,
                    status: "Connected",
                    timestamp: new Date().toISOString()
                },
                message: "Bitnob API connection successful"
            };
        } catch (error) {
            console.error("❌ Connection test failed:", error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || error.message,
                message: "Bitnob API connection failed",
                suggestion: "Consider using mock mode for development"
            };
        }
    }

    /**
     * Enable mock mode for development
     */
    enableMockMode() {
        this.useMockMode = true;
        console.log("🧪 Mock mode enabled for development");
    }

    /**
     * Disable mock mode
     */
    disableMockMode() {
        this.useMockMode = false;
        console.log("🔌 Mock mode disabled - using real API");
    }
}

// Create instances - one for production, one for development
const bitnobService = new BitnobService();
const bitnobServiceMock = new BitnobService({ useMockMode: true });

// Export both instances and class
module.exports = {
    bitnobService,
    bitnobServiceMock,
    BitnobService
};

// Demo function showing both modes
async function demoModes() {
    console.log("🚀 Bitnob Service Demo - Real vs Mock Mode");
    console.log("==========================================\n");

    // Test Real API
    console.log("1️⃣ Testing Real API:");
    const realResult = await bitnobService.createVirtualCard("John Doe", 100);
    console.log("Real API Result:", realResult);
    console.log("---");

    // Test Mock API
    console.log("2️⃣ Testing Mock API:");
    const mockResult = await bitnobServiceMock.createVirtualCard("Jane Smith", 150);
    console.log("Mock API Result:", mockResult);
    console.log("---");

    // Get all cards from mock
    console.log("3️⃣ Getting Mock Cards:");
    const mockCards = await bitnobServiceMock.getAllCards();
    console.log("Mock Cards:", mockCards);
    console.log("---");

    // Test topup in mock mode
    if (mockResult.success && mockResult.data.cardId) {
        console.log("4️⃣ Testing Mock Topup:");
        const topupResult = await bitnobServiceMock.topUpCard(mockResult.data.cardId, 50);
        console.log("Mock Topup Result:", topupResult);
    }
}

// Uncomment to run demo
// demoModes().catch(console.error);
