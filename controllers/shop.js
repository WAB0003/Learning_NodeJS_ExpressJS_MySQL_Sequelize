// Bring in Required Models to access Table Information
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order') 

//All Products
exports.getProducts = (req, res, next) => {
  Product.findAll()       //Sequelize method
  .then((products)=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err=>console.log(err))  
};

//Single Product
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  //Using Findall method using WHERE query
  Product.findAll({where: { id: prodId}})
  .then(products=>{
    res.render('shop/product-detail', {
          product: products[0],
          pageTitle: products[0].title,
          path: '/products'
        });
  })
  .catch(err=>console.log(err))
  // Usinng FindByPk method
  // Product.findByPk(prodId).then((product)=>{
  //   res.render('shop/product-detail', {
  //     product: product,
  //     pageTitle: product.title,
  //     path: '/products'
  //   });
  // }).catch(err=>console.log(err));
};

// Used for Shop Home Page
exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
    console.log(req.user)
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err=>console.log(err))
  
};

exports.getCart = (req, res, next) => {
  req.user.getCart()                //Sequelize magic to return promise (Sequelize Special methods/mixins add to isntances (https://sequelize.org/docs/v6/core-concepts/assocs/)
  .then(cart => {
    return cart.getProducts()       //Sequelize magic to return promise of products      
    .then(cartProducts =>{
      res.render('shop/cart', {
              path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      })
    }).catch(err=>console.log(err));
  }).catch(err=>console.log(err))
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  req.user
    .getCart()
    .then(cart=>{
      fetchedCart = cart;
      let newQuantity = 1;
      return cart.getProducts({where: { id:prodId } })
        .then(cartProducts => {
          let product; // create an empty product variable
          // check to see if there is a product
          if (cartProducts.length > 0){
            product = cartProducts[0];
          }
          
          // IF PRODUCT EXISTS
          if (product) {
            const oldQuantity = product.cartItem.quantity; //cartItem gets quantity for product as stored in cart
            newQuantity = oldQuantity + 1;
            return product;
          }
          // ELSE FIND THE PRODUCT BY ID AND ADD IT TO THE EXISTING CART AND UPDATE QUANTITY IN CARTITEMS:
          return Product.findByPk(prodId)
        })
        .then(product => {
          return fetchedCart.addProduct(product, 
            { through: {quantity: newQuantity } }
          );
        })
        .then(()=>{
          res.redirect('./cart')
        })
    })
    .catch(err=>console.log(err))

};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(fetchedCart => {
      return fetchedCart.getProducts({ where: {id:prodId} });
    })
    .then(products => {
      const product = products[0];
      product.cartItem.destroy() // DELETES ASSOCIATION FROM CARTITEM TABLE SO NO RELATIONSHIP EXISTS ANYMORE!
    })
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err=>console.log(err))


  Product.findByPk(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.postOrder = (req,res,next) => {
  let fetchedCart;
  req.user
  .getCart()
  .then(
    cart => {
      fetchedCart = cart;
      return cart.getProducts();    //Return products
    }
  )
  .then(
    products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(
              product => {
                product.orderItem = { quantity: product.cartItem.quantity };  //add a orderItem quanity field to product
                return product
              }
            )
          )
        })
        .catch(err => console.log(err))
    }
  ).then(result => {
    return fetchedCart.setProducts(null);
  }).then(result => {
    res.redirect('/orders')
  })
  .catch(err=>console.log(err))
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})   //Because Order Model 'belongs to Many Product', you need to specify get Orders to include products when called
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders:orders
    });
  })
  .catch(err=>{
    console.log(err)
  })
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
