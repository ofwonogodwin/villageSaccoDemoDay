const axios = require("axios");
require("dotenv").config();

async function quickTest() {
    const BITNOB_BASE_URL = process.env.BITNOB_BASE_URL;
    const BITNOB_SECRET_KEY = process.env.BITNOB_SECRET_KEY;

    console.log("🔧 Debug Information:");
    console.log("Base URL:", BITNOB_BASE_URL);
    console.log("Secret Key exists:", !!BITNOB_SECRET_KEY);
    console.log("Secret Key starts with:", BITNOB_SECRET_KEY?.substring(0, 10) + "...");
    console.log("---");

    const headers = {
        Authorization: `Bearer ${BITNOB_SECRET_KEY}`,
        "Content-Type": "application/json"
    };

    // Test 1: Simple GET to base URL
    try {
        console.log("Test 1: GET to base URL");
        const response = await axios.get(BITNOB_BASE_URL, {
            headers,
            timeout: 10000
        });
        console.log("✅ Base URL Success:", response.status, response.data);
    } catch (error) {
        console.log("❌ Base URL Error:", error.response?.status, error.response?.data || error.message);
    }

    // Test 2: Test root API
    try {
        console.log("\nTest 2: GET to /api");
        const response = await axios.get(`${BITNOB_BASE_URL}/api`, {
            headers,
            timeout: 10000
        });
        console.log("✅ /api Success:", response.status, response.data);
    } catch (error) {
        console.log("❌ /api Error:", error.response?.status, error.response?.data || error.message);
    }

    // Test 3: Test v1 API
    try {
        console.log("\nTest 3: GET to /api/v1");
        const response = await axios.get(`${BITNOB_BASE_URL}/api/v1`, {
            headers,
            timeout: 10000
        });
        console.log("✅ /api/v1 Success:", response.status, response.data);
    } catch (error) {
        console.log("❌ /api/v1 Error:", error.response?.status, error.response?.data || error.message);
    }

    // Test 4: Test without auth to see if endpoint exists
    try {
        console.log("\nTest 4: GET to /api/v1/virtual-cards (no auth)");
        const response = await axios.get(`${BITNOB_BASE_URL}/api/v1/virtual-cards`, {
            timeout: 10000
        });
        console.log("✅ No auth Success:", response.status, response.data);
    } catch (error) {
        const status = error.response?.status;
        if (status === 401) {
            console.log("🔐 No auth shows 401 - endpoint exists but requires auth");
        } else if (status === 404) {
            console.log("❌ No auth shows 404 - endpoint doesn't exist");
        } else {
            console.log("❓ No auth Error:", status, error.response?.data || error.message);
        }
    }
}

quickTest().catch(console.error);
