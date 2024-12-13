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
app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from your frontend
    methods: ['GET', 'POST'],        // Specify allowed HTTP methods
    credentials: true,                // Allow cookies to be sent with requests
}));
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


// const postToVtex = async (url, data, headers = {}) => {
//     try {
//         const response = await axios.post(url, data, { headers });
//         return response.data;
//     } catch (error) {
//         console.error(`Error posting data to VTEX API:`, {
//             message: error.message,
//             response: error.response?.data || "No response data",
//         });
//         throw error;
//     }
// };


app.get('/product/:productId/variants', async (req, res) => {
    try {
        const productId = req.params.productId; // Get product ID from the URL
        if (!productId) {
            return res.status(400).send('Product ID is required');
        }

        const headers = {
            'X-VTEX-API-AppKey': VTEX_API_APP_KEY,
            'X-VTEX-API-AppToken': VTEX_API_APP_TOKEN,
        };

        const url = `${VTEX_API_URL}/api/catalog_system/pub/products/variations/${productId}`;
        const productVariants = await fetchFromVtex(url, headers);
        res.json(productVariants);
    } catch (error) {
        console.error('Error fetching product variants:', error);
        res.status(500).send('Error fetching product variants from VTEX API');
    }
});
// Route to fetch all products
// app.get('/products', async (req, res) => {
//     try {
//         const headers = {
//             'X-VTEX-API-AppKey': VTEX_API_APP_KEY,
//             'X-VTEX-API-AppToken': VTEX_API_APP_TOKEN,
//         };
//         // Ensure you are fetching the correct products endpoint
//         const products = await fetchFromVtex(`${VTEX_API_URL}/api/catalog_system/pub/products/search`, headers); // Append /products if necessary
//         res.json(products);
//     } catch (error) {
//         res.status(500).send('Error fetching products from VTEX API');
//     }
// });

app.get('/sku/:skuId', async (req, res) => {
    try {
        const skuId = req.params.skuId; // Get SKU ID from the URL
        if (!skuId) {
            return res.status(400).send('SKU ID is required');
        }

        const headers = {
            'X-VTEX-API-AppKey': VTEX_API_APP_KEY,
            'X-VTEX-API-AppToken': VTEX_API_APP_TOKEN,
        };

        const url = `${VTEX_API_URL}/api/catalog_system/pvt/sku/stockkeepingunitbyid/${skuId}`;
        const skuDetails = await fetchFromVtex(url, headers);
        res.json(skuDetails);
    } catch (error) {
        console.error('Error fetching SKU details:', error);
        res.status(500).send('Error fetching SKU details from VTEX API');
    }
});





app.get('/recommendations/:skuId', async (req, res) => {
    try {
        const skuId = req.params.skuId;
        if (!skuId) {
            return res.status(400).send('SKU ID is required');
        }

        const headers = {
            'X-VTEX-API-AppKey': VTEX_API_APP_KEY,
            'X-VTEX-API-AppToken': VTEX_API_APP_TOKEN,
        };

        // Step 1: Fetch product details using the SKU ID
        const skuUrl = `${VTEX_API_URL}/api/catalog_system/pvt/sku/stockkeepingunitbyid/${skuId}`;
        const skuDetails = await fetchFromVtex(skuUrl, headers);

        const productId = skuDetails.ProductId; // Extract the Product ID
        console.log(productId);

        if (!productId) {
            return res.status(404).send('Product ID not found for the given SKU ID');
        }

        // Step 2: Fetch recommendation products using the Product ID
        const recommendationsUrl = `${VTEX_API_URL}/api/catalog_system/pub/products/crossselling/similars/${productId}`;
        const recommendations = await fetchFromVtex(recommendationsUrl, headers);

        res.json(recommendations);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).send('Error fetching recommendation products from VTEX API');
    }
});

app.get('/pricing/:skuId', async (req, res) => {
    try {
        const skuId = req.params.skuId; // Get SKU ID from the URL
        if (!skuId) {
            return res.status(400).send('SKU ID is required');
        }

        const headers = {
            'X-VTEX-API-AppKey': VTEX_API_APP_KEY,
            'X-VTEX-API-AppToken': VTEX_API_APP_TOKEN,
        };

        // VTEX Pricing API URL
        const url = `${VTEX_API_URL}/iamtechiepartneruae/pricing/prices/${skuId}`;
        const pricingDetails = await fetchFromVtex(url, headers);
        res.json(pricingDetails);
    } catch (error) {
        console.error('Error fetching pricing details:', error);
        res.status(500).send('Error fetching pricing details from VTEX API');
    }
});

// Route to fetch products in a specific collection
app.get('/collectionProduct', async (req, res) => {
    try {
        const collectionId = req.query.collectionId; // Get collectionId from query parameters
        if (!collectionId) {
            return res.status(400).send('Collection ID is required');
        }

        const headers = {
            'X-VTEX-API-AppKey': VTEX_API_APP_KEY,
            'X-VTEX-API-AppToken': VTEX_API_APP_TOKEN,
        };

        const url = `${VTEX_API_URL}/api/catalog/pvt/collection/${collectionId}/products`;
        const products = await fetchFromVtex(url, headers);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products from VTEX API');
    }
});

// Route to fetch products based on search query
// app.get('/searchProducts', async (req, res) => {
//     try {
//         const searchQuery = req.query.q; // Get search query from query parameters
//         if (!searchQuery) {
//             return res.status(400).send('Search query is required');
//         }

//         const headers = {
//             'X-VTEX-API-AppKey': VTEX_API_APP_KEY,
//             'X-VTEX-API-AppToken': VTEX_API_APP_TOKEN,
//         };

//         const url = `https://iamtechiepartneruae.vtexcommercestable.com.br/api/catalog_system/pub/products/search/${encodeURIComponent(searchQuery)}`;
//         const response = await fetch(url, { headers });
//         if (!response.ok) {
//             throw new Error(`VTEX API error: ${response.statusText}`);
//         }

//         const products = await response.json();
//         res.json(products);
//     } catch (error) {
//         console.error('Error fetching search results:', error);
//         res.status(500).send('Error fetching search results from VTEX API');
//     }
// });





//use search product api and Get product's SKUs by product ID 
app.get('/searchProducts', async (req, res) => {
    try {
        const searchQuery = req.query.q; // Get search query from query parameters
        if (!searchQuery) {
            return res.status(400).send('Search query is required');
        }

        const headers = {
            'X-VTEX-API-AppKey': VTEX_API_APP_KEY,
            'X-VTEX-API-AppToken': VTEX_API_APP_TOKEN,
        };

        const url = `${VTEX_API_URL}/api/catalog_system/pub/products/search/${encodeURIComponent(searchQuery)}`;
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`VTEX API error: ${response.statusText}`);
        }

        const products = await response.json();

        // Fetch variations (SKUs) for each product
        const productsWithSkus = await Promise.all(
            products.map(async (product) => {
                const variationsUrl = `${VTEX_API_URL}/api/catalog_system/pub/products/variations/${product.productId}`;
                const variationsResponse = await fetch(variationsUrl, { headers });
                if (variationsResponse.ok) {
                    const skuDetails = await variationsResponse.json();
                    product.skus = skuDetails;
                } else {
                    product.skus = [];
                }
                return product;
            })
        );

        res.json(productsWithSkus);
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).send('Error fetching search results from VTEX API');
    }
});


// 

// app.post('/simulateOrder', async (req, res) => {
//     try {
//         const { items, postalCode, country } = req.body;
//         if (!items || !postalCode || !country) {
//             return res.status(400).send('Items, postalCode, and country are required');
//         }

//         const headers = {
//             'X-VTEX-API-AppKey': VTEX_API_APP_KEY,
//             'X-VTEX-API-AppToken': VTEX_API_APP_TOKEN,
//             'Content-Type': 'application/json',
//         };

//         const url = `${VTEX_API_URL}/api/checkout/pub/orderForms/simulation`;
//         const requestBody = {
//             items: items.map(item => ({
//                 id: item.id,
//                 quantity: item.quantity,
//                 seller: item.seller || '1',
//             })),
//             postalCode,
//             country,
//         };

//         const simulationResult = await postToVtex(url, requestBody, headers);
//         console.log('Simulation Result:', simulationResult);
//         res.json(simulationResult);
//     } catch (error) {
//         console.error('Error simulating order:', error);
//         res.status(500).send('Error simulating order with VTEX API');
//     }
// });


// app.get('/cart/', async (req, res) => {
//     try {
//         const headers = {
//             'X-VTEX-API-AppKey': VTEX_API_APP_KEY,
//             'X-VTEX-API-AppToken': VTEX_API_APP_TOKEN,
//         };

//         const url = `${VTEX_API_URL}/api/checkout/pub/orderForm`;
//         const orderForm = await fetchFromVtex(url, headers);

//         res.json(orderForm);
//     } catch (error) {
//         console.error('Error fetching OrderForm:', error);
//         res.status(500).send('Error fetching OrderForm from VTEX API');
//     }
// });
// // create card



// app.get('/cart/:orderFormId', async (req, res) => {
//     try {
//         const { orderFormId } = req.params;
//         const headers = {
//             'X-VTEX-API-AppKey': VTEX_API_APP_KEY,
//             'X-VTEX-API-AppToken': VTEX_API_APP_TOKEN,
//         };
//         const url = `${VTEX_API_URL}/api/checkout/pub/orderForm/${orderFormId}`;
//         const orderForm = await fetchFromVtex(url, headers);
//         res.json(orderForm);
//     } catch (error) {
//         console.error('Error fetching OrderForm:', error.message);
//         res.status(500).send('Error fetching OrderForm from VTEX API');
//     }
// });



// app.post('/add-to-cart/:orderFormId', async (req, res) => {
//     const { orderFormId } = req.params;
//     const { orderItems } = req.body;
//     if (!orderItems) {
//         return res.status(400).json({ error: 'Item data is required' });
//     }

//     try {
//         const response = await axios.post(
//             `${VTEX_API_URL}/api/checkout/pub/orderForm/${orderFormId}/items`,
//             { orderItems },
//             {
//                 headers: {
//                     'X-VTEX-API-AppKey': process.env.VTEX_API_APP_KEY,
//                     'X-VTEX-API-AppToken': process.env.VTEX_API_APP_TOKEN,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );
//         res.status(response.status).json(response.data);
//     } catch (error) {
//         console.error('Error adding item to cart:', error.message);
//         res.status(500).json({ error: 'Failed to add item to cart', details: error });
//     }
// });
// 
// Root route for API status
app.get('/', (req, res) => {     
    res.send('VTEX API Server is running!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



















