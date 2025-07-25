#!/usr/bin/env node

const { bitnobServiceMock } = require('./bitnobServiceEnhanced');

async function quickMockDemo() {
    console.log('🚀 Quick Mock Mode Demo');
    console.log('=======================\n');

    // Create some mock cards
    console.log('Creating mock virtual cards...');

    const card1 = await bitnobServiceMock.createVirtualCard('Godwin Ofwono', 100, 'USD');
    console.log('✅ Card 1 Created:', card1.data);

    const card2 = await bitnobServiceMock.createVirtualCard('Alice Johnson', 200, 'EUR');
    console.log('✅ Card 2 Created:', card2.data);

    // Get all cards
    console.log('\nGetting all cards...');
    const allCards = await bitnobServiceMock.getAllCards();
    console.log('📋 All Cards:', allCards.data);

    // Top up the first card
    if (card1.success) {
        console.log('\nTopping up first card...');
        const topup = await bitnobServiceMock.topUpCard(card1.data.cardId, 50);
        console.log('💰 Topup Result:', topup);

        // Check updated balance
        const updatedCards = await bitnobServiceMock.getAllCards();
        console.log('📋 Updated Cards:', updatedCards.data);
    }

    // Test connection
    console.log('\nTesting connection...');
    const connection = await bitnobServiceMock.testConnection();
    console.log('🔗 Connection Test:', connection);

    console.log('\n✅ Mock mode working perfectly!');
    console.log('💡 You can use this for development while the real API is being configured.');
}

quickMockDemo().catch(console.error);
