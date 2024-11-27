require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Validate required environment variables
if (!process.env.VTEX_API_URL || !process.env.VTEX_API_APP_KEY || !process.env.VTEX_API_APP_TOKEN) {
    throw new Error("Missing required environment variables. Please check your .env file.");
}

// API credentials and URL from .env file
const VTEX_API_URL = process.env.VTEX_API_URL;
const VTEX_API_APP_KEY = process.env.VTEX_API_APP_KEY;
const VTEX_API_APP_TOKEN = process.env.VTEX_API_APP_TOKEN;

// Middleware to handle JSON responses and CORS
app.use(express.json());
app.use(cors());

// Helper function for VTEX API requests
const fetchFromVtex = async (url, headers = {}) => {
    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from VTEX API:`, {
            message: error.message,
            response: error.response?.data || "No response data",
        });
        throw error;
    }
};

// Route to fetch all products
app.get('/products', async (req, res) => {
    try {
        const headers = {
            'X-VTEX-API-AppKey': VTEX_API_APP_KEY,
            'X-VTEX-API-AppToken': VTEX_API_APP_TOKEN,
        };
        // Ensure you are fetching the correct products endpoint
        const products = await fetchFromVtex(`${VTEX_API_URL}/api/catalog_system/pub/products/search`, headers); // Append /products if necessary
        res.json(products);
    } catch (error) {
        res.status(500).send('Error fetching products from VTEX API');
    }
});

// Route to fetch products in a specific collection
app.get('/collectionProduct', async (req, res) => {
    try {
        const headers = {
            'X-VTEX-API-AppKey': VTEX_API_APP_KEY,
            'X-VTEX-API-AppToken': VTEX_API_APP_TOKEN,
        };
        // You already have a full URL here, no need to modify it
        const products = await fetchFromVtex(`${VTEX_API_URL}/api/catalog/pvt/collection/138/products`, headers);
        res.json(products);
    } catch (error) {
        res.status(500).send('Error fetching products from VTEX API');
    }
});

// Root route for API status
app.get('/', (req, res) => {
    res.send('VTEX API Server is running!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});























// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// const app = express();
// const port = process.env.PORT || 3000;

// // API credentials and URL from .env file
// const VTEX_API_URL = process.env.VTEX_API_URL;
// const VTEX_API_APP_KEY = process.env.VTEX_API_APP_KEY;
// const VTEX_API_APP_TOKEN = process.env.VTEX_API_APP_TOKEN;

// // Middleware to handle JSON responses
// app.use(express.json());
// app.use(cors());

// // Route to fetch products
// app.get('/products', async (req, res) => {
//     try {
//         const response = await axios.get(VTEX_API_URL, {
//             headers: {
//                 'X-VTEX-API-AppKey': VTEX_API_APP_KEY,
//                 'X-VTEX-API-AppToken': VTEX_API_APP_TOKEN
//             }
//         });
//         res.json(response.data);  // Send the product data as JSON response
//     } catch (error) {
//         console.error('Error fetching products from VTEX:', error);
//         res.status(500).send('Error fetching products from VTEX API');
//     }
// });
// // Route to fetch products for a specific collection ID (138)
// app.get('/collection', async (req, res) => {
//     try {
//         const response = await axios.get(`https://iamtechiepartneruae.vtexcommercestable.com.br/api/catalog/pvt/collection/138/products`, {
//             headers: {
//                 'X-VTEX-API-AppKey': VTEX_API_APP_KEY,
//                 'X-VTEX-API-AppToken': VTEX_API_APP_TOKEN
//             }
//         });
//         res.json(response.data);  // Send the product data for collection 138 as JSON response
//     } catch (error) {
//         console.error('Error fetching products from VTEX:', error);
//         res.status(500).send('Error fetching products from VTEX API');
//     }
// });


// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });



