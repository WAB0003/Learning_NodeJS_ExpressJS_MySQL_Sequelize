// Use ExpressJS to create Routes.
const express = require('express');
const router = express.Router();    //Router() method creates a router object

// Call in controller that handles all Logic for Routes
const adminController = require('../controllers/admin');

// ROUTES:
//SYNTAX = router.METHOD('ROUTE_PATH', CALL BACK FUNCTION)
// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
