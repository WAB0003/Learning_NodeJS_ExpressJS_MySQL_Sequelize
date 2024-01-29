// Use ExpressJS to create Routes.
const express = require('express');
const router = express.Router();    //Router() method creates a 'mountable' router object instance

// Call in CONTROLLER that handles all Logic for Routes
const shopController = require('../controllers/shop');

//SHOP ROUTES
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.get('/orders', shopController.getOrders);

router.post('/create-order', shopController.postOrder);

// router.get('/checkout', shopController.getCheckout);

module.exports = router;
