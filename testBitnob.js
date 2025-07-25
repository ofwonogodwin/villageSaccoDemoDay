#!/usr/bin/env node

/**
 * Test script for Bitnob Service
 * Run with: node testBitnob.js
 */

const { bitnobService } = require('./bitnobService');

async function main() {
    console.log('🚀 Testing Bitnob Virtual Card Service');
    console.log('=====================================\n');

    try {
        // Test 1: Connection Test
        console.log('1. Testing API Connection...');
        const connectionResult = await bitnobService.testConnection();

        if (connectionResult.success) {
            console.log('✅ Connection successful!');
            console.log('   Base URL:', connectionResult.data.baseUrl);
            console.log('   Status:', connectionResult.data.status);
        } else {
            console.log('❌ Connection failed:', connectionResult.message);
            console.log('   Error:', connectionResult.error);
            return; // Exit if connection fails
        }

        console.log('\n---\n');

        // Test 2: Create Virtual Card
        console.log('2. Creating Virtual Card...');
        const cardResult = await bitnobService.createVirtualCard('Godwin Ofwono', 50, 'USD');

        if (cardResult.success) {
            console.log('✅ Card created successfully!');
            console.log('   Card Data:', JSON.stringify(cardResult.data, null, 2));

            // If we have a card ID, run additional tests
            if (cardResult.data?.cardId) {
                const cardId = cardResult.data.cardId;

                console.log('\n---\n');

                // Test 3: Get Card Details
                console.log('3. Getting Card Details...');
                const detailsResult = await bitnobService.getCardById(cardId);

                if (detailsResult.success) {
                    console.log('✅ Card details retrieved!');
                    console.log('   Details:', JSON.stringify(detailsResult.data, null, 2));
                } else {
                    console.log('❌ Failed to get card details:', detailsResult.message);
                }

                console.log('\n---\n');

                // Test 4: Top Up Card
                console.log('4. Topping Up Card...');
                const topupResult = await bitnobService.topUpCard(cardId, 25, 'USD');

                if (topupResult.success) {
                    console.log('✅ Card topped up successfully!');
                    console.log('   Topup Data:', JSON.stringify(topupResult.data, null, 2));
                } else {
                    console.log('❌ Failed to top up card:', topupResult.message);
                }
            }
        } else {
            console.log('❌ Card creation failed:', cardResult.message);
            console.log('   Error:', cardResult.error);
        }

        console.log('\n---\n');

        // Test 5: Get All Cards
        console.log('5. Getting All Cards...');
        const allCardsResult = await bitnobService.getAllCards();

        if (allCardsResult.success) {
            console.log('✅ All cards retrieved!');
            const cards = allCardsResult.data?.cards || [];
            console.log(`   Found ${cards.length} card(s)`);

            if (cards.length > 0) {
                cards.forEach((card, index) => {
                    console.log(`   Card ${index + 1}:`, {
                        id: card.id,
                        status: card.status,
                        balance: card.balance,
                        currency: card.currency,
                        maskedNumber: card.maskedCardNumber
                    });
                });
            }
        } else {
            console.log('❌ Failed to get all cards:', allCardsResult.message);
        }

    } catch (error) {
        console.error('💥 Unexpected error:', error.message);
    }

    console.log('\n🏁 Test completed!');
}

// Run the tests
main().catch(console.error);
