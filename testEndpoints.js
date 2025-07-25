const axios = require("axios");
require("dotenv").config();

async function testBitnobEndpoints() {
    const BITNOB_SECRET_KEY = process.env.BITNOB_SECRET_KEY;

    // Try different possible base URLs
    const baseUrls = [
        "https://sandboxapi.bitnob.co",
        "https://api.bitnob.co",
        "https://sandbox.bitnob.co",
        "https://bitnob.co/api",
        "https://api.bitnob.io",
        "https://sandbox.bitnob.io"
    ];

    const headers = {
        Authorization: `Bearer ${BITNOB_SECRET_KEY}`,
        "Content-Type": "application/json"
    };

    for (const baseUrl of baseUrls) {
        console.log(`\n🔍 Testing base URL: ${baseUrl}`);
        console.log("---");

        const endpoints = [
            "/",
            "/api",
            "/api/v1",
            "/api/v1/virtual-cards",
            "/api/v1/cards",
            "/virtual-cards",
            "/cards"
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await axios.get(`${baseUrl}${endpoint}`, {
                    headers,
                    timeout: 5000
                });

                console.log(`✅ ${endpoint}: ${response.status} - ${JSON.stringify(response.data).substring(0, 100)}...`);

                // If we found a working endpoint, return it
                if (response.status === 200) {
                    console.log(`🎉 FOUND WORKING ENDPOINT: ${baseUrl}${endpoint}`);
                    return { baseUrl, endpoint, response: response.data };
                }

            } catch (error) {
                const status = error.response?.status;
                const message = error.response?.data?.message || error.message;

                if (status === 401) {
                    console.log(`🔐 ${endpoint}: 401 - Endpoint exists but unauthorized`);
                } else if (status === 403) {
                    console.log(`🚫 ${endpoint}: 403 - Endpoint exists but forbidden`);
                } else if (status === 400) {
                    console.log(`⚠️  ${endpoint}: 400 - Endpoint exists but bad request`);
                } else if (status && status !== 404) {
                    console.log(`❓ ${endpoint}: ${status} - ${message}`);
                }
                // Don't log 404s to reduce noise
            }
        }
    }

    console.log("\n❌ No working endpoints found. This might indicate:");
    console.log("1. Incorrect API credentials");
    console.log("2. Sandbox environment is down");
    console.log("3. Different endpoint structure");
    console.log("4. Need to register/activate the API key first");
}

testBitnobEndpoints().catch(console.error);
