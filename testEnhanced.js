#!/usr/bin/env node

/**
 * Enhanced Test Script for Bitnob Service
 * Tests both real API and mock mode
 */

const { bitnobService, bitnobServiceMock } = require('./bitnobServiceEnhanced');

async function main() {
    console.log('🚀 Enhanced Bitnob Service Test');
    console.log('===============================\n');

    // Test 1: Try Real API Connection
    console.log('1. Testing Real API Connection...');
    const connectionResult = await bitnobService.testConnection();

    console.log('Connection Result:', connectionResult);

    if (!connectionResult.success) {
        console.log('\n⚠️  Real API not available. Switching to Mock Mode for demonstration.\n');

        // Test 2: Mock Mode Demo
        console.log('2. Demonstrating Mock Mode...');

        // Create mock cards
        console.log('\n📋 Creating mock virtual cards:');

        const mockCard1 = await bitnobServiceMock.createVirtualCard('Godwin Ofwono', 100, 'USD');
        console.log('Card 1:', mockCard1);

        const mockCard2 = await bitnobServiceMock.createVirtualCard('Alice Johnson', 200, 'USD');
        console.log('Card 2:', mockCard2);

        const mockCard3 = await bitnobServiceMock.createVirtualCard('Bob Smith', 50, 'USD');
        console.log('Card 3:', mockCard3);

        // Get all mock cards
        console.log('\n📋 Getting all mock cards:');
        const allCards = await bitnobServiceMock.getAllCards();
        console.log('All Cards:', allCards);

        // Top up a card
        if (mockCard1.success && mockCard1.data.cardId) {
            console.log('\n💰 Topping up first card:');
            const topupResult = await bitnobServiceMock.topUpCard(mockCard1.data.cardId, 25);
            console.log('Topup Result:', topupResult);

            // Get updated cards
            console.log('\n📋 Getting updated card list:');
            const updatedCards = await bitnobServiceMock.getAllCards();
            console.log('Updated Cards:', updatedCards);
        }

        // Test connection in mock mode
        console.log('\n🔗 Testing mock connection:');
        const mockConnection = await bitnobServiceMock.testConnection();
        console.log('Mock Connection:', mockConnection);

    } else {
        console.log('\n✅ Real API is available! Testing real endpoints...');

        // Test real API endpoints
        console.log('\n💳 Creating real virtual card:');
        const realCard = await bitnobService.createVirtualCard('Godwin Ofwono', 50, 'USD');
        console.log('Real Card Result:', realCard);

        console.log('\n📋 Getting real cards:');
        const realCards = await bitnobService.getAllCards();
        console.log('Real Cards:', realCards);
    }

    console.log('\n🏁 Test completed!');
    console.log('\n💡 Usage Tips:');
    console.log('- Use bitnobService for production with real API');
    console.log('- Use bitnobServiceMock for development and testing');
    console.log('- Mock mode allows you to test UI/UX without API calls');
    console.log('- Switch between modes using enableMockMode() / disableMockMode()');
}

// Run the tests
main().catch(console.error);
