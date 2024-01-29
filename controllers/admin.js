
// ONLY MODEL REQUIRED FOR ADMIN LEVEL IS PRODUCT
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  // Create variables for required information from router.body object instance
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

    // OLD WAY - Create new product using Sequelize//ADD DATA
    // Product.create({
    //   title: title, 
    //   imageUrl: imageUrl, 
    //   price: price, 
    //   description: description,
    // })
  // SEQUEL MAGIC
  req.user.createProduct({              //Sequelize Special methods/mixins add to isntances (https://sequelize.org/docs/v6/core-concepts/assocs/)
    title: title, 
    imageUrl: imageUrl, 
    price: price, 
    description: description,
  })
  .then(response=>{
    // console.log(res)
    console.log(`${title} created`);
    res.redirect('/admin/products')
  })
  .catch(err=>console.log(err))
};

exports.getProducts = (req, res, next) => {
  // Product.findAll()
  req.user.getProducts()                          //Sequelize Special methods/mixins add to isntances (https://sequelize.org/docs/v6/core-concepts/assocs/)
  .then(products=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err=>console.log(err))
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  console.log('made it this far')
  const prodId = req.params.productId;
  //May only need products from a Current User
  // Because relationships were defined in app.js, you can do this:
  req.user.getProducts({where: {id:prodId}})  //Sequelize Special methods/mixins add to isntances (https://sequelize.org/docs/v6/core-concepts/assocs/)
  // Product.findByPk(prodId)                 //Old method
  .then(products => {
    const product = products[0]
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
  .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findByPk(prodId)
  .then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;

    return product.save()  // built in method with sequelize to save but save method returns a promise
  })
  .then(r => {
    console.log('Product Updated');
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err))
};



exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
  .then(product => {
    return product.destroy();
  })
  .then(r => {
    console.log('Product Destroyed');
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err))
};
