const axios = require("axios");
require("dotenv").config();

const BITNOB_BASE_URL = process.env.BITNOB_BASE_URL;
const BITNOB_SECRET_KEY = process.env.BITNOB_SECRET_KEY;

const headers = {
    Authorization: `Bearer ${BITNOB_SECRET_KEY}`,
    "Content-Type": "application/json"
};

async function discoverEndpoints() {
    console.log("🔍 Discovering Bitnob API endpoints...");
    console.log("Base URL:", BITNOB_BASE_URL);
    console.log("---");

    const possibleEndpoints = [
        // Virtual Cards endpoints
        "/api/v1/virtual-cards",
        "/api/v1/cards",
        "/virtual-cards",
        "/cards",
        "/api/v1/card",
        "/api/card",

        // General endpoints
        "/api/v1/profile",
        "/api/v1/user",
        "/api/v1/account",
        "/api/v1/balance",
        "/api/v1/wallet",
        "/api/v1/status",
        "/api/v1/health",
        "/ping",
        "/status",

        // Root endpoints
        "/api/v1",
        "/api",
        "/"
    ];

    for (const endpoint of possibleEndpoints) {
        try {
            console.log(`Testing GET ${endpoint}...`);
            const response = await axios.get(`${BITNOB_BASE_URL}${endpoint}`, {
                headers,
                timeout: 5000
            });

            console.log(`✅ SUCCESS: ${endpoint}`);
            console.log(`   Status: ${response.status}`);
            console.log(`   Data:`, JSON.stringify(response.data, null, 2));
            console.log("---");

        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message || error.message;

            if (status === 404) {
                console.log(`❌ 404: ${endpoint} - Not Found`);
            } else if (status === 401) {
                console.log(`🔐 401: ${endpoint} - Unauthorized (endpoint exists but auth failed)`);
            } else if (status === 403) {
                console.log(`🚫 403: ${endpoint} - Forbidden (endpoint exists but access denied)`);
            } else if (status === 400) {
                console.log(`⚠️  400: ${endpoint} - Bad Request (endpoint exists but invalid request)`);
            } else if (status === 500) {
                console.log(`🔥 500: ${endpoint} - Server Error (endpoint exists but server error)`);
            } else {
                console.log(`❓ ${status || 'ERROR'}: ${endpoint} - ${message}`);
            }
        }
    }

    console.log("\n🏁 Endpoint discovery completed!");
}

// Run discovery
discoverEndpoints().catch(console.error);
