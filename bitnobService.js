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
 * Bitnob Service Class for Virtual Card Operations
 */
class BitnobService {
  
  /**
   * Create a virtual card
   * @param {string} userName - User's name for the card
   * @param {number} amount - Initial amount to load on the card
   * @param {string} currency - Currency code (default: USD)
   * @returns {Promise<Object>} Card creation response
   */
  async createVirtualCard(userName, amount, currency = "USD") {
    const payload = {
      currency,
      amount,
      userName,
      reference: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    try {
      console.log(`🏦 Creating virtual card for ${userName} with ${currency} ${amount}`);
      
      const response = await axios.post(
        `${BITNOB_BASE_URL}/api/v1/virtual-cards`, 
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
      return {
        success: false,
        error: error.response?.data || error.message,
        message: "Failed to create virtual card"
      };
    }
  }

  /**
   * Get all virtual cards for the authenticated user
   * @returns {Promise<Object>} List of virtual cards
   */
  async getAllCards() {
    try {
      console.log("📋 Fetching all virtual cards...");
      
      const response = await axios.get(
        `${BITNOB_BASE_URL}/api/v1/virtual-cards`, 
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
   * Get details of a specific virtual card
   * @param {string} cardId - The ID of the card
   * @returns {Promise<Object>} Card details
   */
  async getCardById(cardId) {
    try {
      console.log(`🔍 Fetching card details for ID: ${cardId}`);
      
      const response = await axios.get(
        `${BITNOB_BASE_URL}/api/v1/virtual-cards/${cardId}`, 
        { headers }
      );
      
      console.log("✅ Card details retrieved successfully");
      return {
        success: true,
        data: response.data,
        message: "Card details retrieved successfully"
      };
    } catch (error) {
      console.error("❌ Error fetching card:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
        message: "Failed to fetch card details"
      };
    }
  }

  /**
   * Top up a virtual card
   * @param {string} cardId - The ID of the card to top up
   * @param {number} amount - Amount to add to the card
   * @param {string} currency - Currency code (default: USD)
   * @returns {Promise<Object>} Top up response
   */
  async topUpCard(cardId, amount, currency = "USD") {
    const payload = {
      cardId,
      amount,
      currency,
      reference: `topup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    try {
      console.log(`💰 Topping up card ${cardId} with ${currency} ${amount}`);
      
      const response = await axios.post(
        `${BITNOB_BASE_URL}/api/v1/virtual-cards/topup`, 
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
   * Freeze a virtual card
   * @param {string} cardId - The ID of the card to freeze
   * @param {string} reason - Reason for freezing (optional)
   * @returns {Promise<Object>} Freeze response
   */
  async freezeCard(cardId, reason = "User requested") {
    const payload = {
      cardId,
      reason
    };

    try {
      console.log(`🧊 Freezing card ${cardId}`);
      
      const response = await axios.post(
        `${BITNOB_BASE_URL}/api/v1/virtual-cards/freeze`, 
        payload, 
        { headers }
      );
      
      console.log("✅ Card frozen successfully:", response.data);
      return {
        success: true,
        data: response.data,
        message: "Card frozen successfully"
      };
    } catch (error) {
      console.error("❌ Error freezing card:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
        message: "Failed to freeze card"
      };
    }
  }

  /**
   * Unfreeze a virtual card
   * @param {string} cardId - The ID of the card to unfreeze
   * @param {string} reason - Reason for unfreezing (optional)
   * @returns {Promise<Object>} Unfreeze response
   */
  async unfreezeCard(cardId, reason = "User requested") {
    const payload = {
      cardId,
      reason
    };

    try {
      console.log(`🔥 Unfreezing card ${cardId}`);
      
      const response = await axios.post(
        `${BITNOB_BASE_URL}/api/v1/virtual-cards/unfreeze`, 
        payload, 
        { headers }
      );
      
      console.log("✅ Card unfrozen successfully:", response.data);
      return {
        success: true,
        data: response.data,
        message: "Card unfrozen successfully"
      };
    } catch (error) {
      console.error("❌ Error unfreezing card:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
        message: "Failed to unfreeze card"
      };
    }
  }

  /**
   * Get card transaction history
   * @param {string} cardId - The ID of the card
   * @param {number} limit - Number of transactions to retrieve (default: 50)
   * @returns {Promise<Object>} Transaction history
   */
  async getCardTransactions(cardId, limit = 50) {
    try {
      console.log(`📊 Fetching transactions for card ${cardId}`);
      
      const response = await axios.get(
        `${BITNOB_BASE_URL}/api/v1/virtual-cards/${cardId}/transactions?limit=${limit}`, 
        { headers }
      );
      
      console.log("✅ Transaction history retrieved successfully");
      return {
        success: true,
        data: response.data,
        message: "Transaction history retrieved successfully"
      };
    } catch (error) {
      console.error("❌ Error fetching transactions:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
        message: "Failed to fetch transaction history"
      };
    }
  }

  /**
   * Terminate/Delete a virtual card
   * @param {string} cardId - The ID of the card to terminate
   * @param {string} reason - Reason for termination (optional)
   * @returns {Promise<Object>} Termination response
   */
  async terminateCard(cardId, reason = "User requested") {
    const payload = {
      cardId,
      reason
    };

    try {
      console.log(`🗑️ Terminating card ${cardId}`);
      
      const response = await axios.post(
        `${BITNOB_BASE_URL}/api/v1/virtual-cards/terminate`, 
        payload, 
        { headers }
      );
      
      console.log("✅ Card terminated successfully:", response.data);
      return {
        success: true,
        data: response.data,
        message: "Card terminated successfully"
      };
    } catch (error) {
      console.error("❌ Error terminating card:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
        message: "Failed to terminate card"
      };
    }
  }

  /**
   * Test the Bitnob API connection and credentials
   * @returns {Promise<Object>} Connection test result
   */
  async testConnection() {
    try {
      console.log("🔗 Testing Bitnob API connection...");
      
      // Test with a simple API call
      const response = await axios.get(
        `${BITNOB_BASE_URL}/api/v1/virtual-cards`, 
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
        message: "Bitnob API connection failed"
      };
    }
  }
}

// Create a singleton instance
const bitnobService = new BitnobService();

// Export the service instance and class
module.exports = {
  bitnobService,
  BitnobService
};

// Example usage and testing functions
async function runTests() {
  console.log("🧪 Starting Bitnob Service Tests...\n");

  // Test 1: Connection test
  console.log("1️⃣ Testing API connection...");
  const connectionTest = await bitnobService.testConnection();
  console.log("Connection Result:", connectionTest);
  console.log("---");

  // Test 2: Create a virtual card
  console.log("2️⃣ Creating virtual card...");
  const cardResult = await bitnobService.createVirtualCard("Godwin Ofwono", 50);
  console.log("Card Creation Result:", cardResult);
  console.log("---");

  // Test 3: Get all cards
  console.log("3️⃣ Fetching all cards...");
  const allCards = await bitnobService.getAllCards();
  console.log("All Cards Result:", allCards);
  console.log("---");

  // If card creation was successful, test additional operations
  if (cardResult.success && cardResult.data?.cardId) {
    const cardId = cardResult.data.cardId;

    // Test 4: Top up the card
    console.log("4️⃣ Topping up card...");
    const topupResult = await bitnobService.topUpCard(cardId, 25);
    console.log("Top Up Result:", topupResult);
    console.log("---");

    // Test 5: Get card details
    console.log("5️⃣ Fetching card details...");
    const cardDetails = await bitnobService.getCardById(cardId);
    console.log("Card Details Result:", cardDetails);
    console.log("---");

    // Test 6: Get card transactions
    console.log("6️⃣ Fetching card transactions...");
    const transactions = await bitnobService.getCardTransactions(cardId);
    console.log("Transactions Result:", transactions);
    console.log("---");
  }

  console.log("🏁 Test completed!");
}

// Uncomment the line below to run tests
// runTests().catch(console.error);

// Quick test function (equivalent to your original)
async function quickTest() {
  console.log("🚀 Quick Test: Creating virtual card for Godwin...");
  const result = await bitnobService.createVirtualCard("Godwin", 50);
  console.log("Result:", result);
}

// Uncomment to run quick test
quickTest().catch(console.error);
