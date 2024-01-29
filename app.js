//ALL VARIABLES
//CREATE AN EXPRESS APP
const express = require('express');
const app = express();

// MIDDLEWARE--------------------------------------------------------------------------------
//typical syntax: app.use(path, callback)

// USE CORE PATH MODULE to bring in local static files such as CSS
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// USE BODY-PARSER to parse http request into a body object (req.body)
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// DEFINE EXPESS APP SETTINGS USING APP.SET()
// https://expressjs.com/en/api.html
app.set('view engine', 'ejs');  // 'view engine' sets a template engine (must download using npm install)
app.set('views', 'views');      // 'views' is a directory or an array of directories for the applications 'views'. In this case, we point to our views folder

// IMPLEMENT SEQUELIZE
// Configure Sequelize is Util/database
// At this point in the program, database connection is made 
const sequelize = require('./util/database');

//DEFINE MODELS IN MODEL FOLDER
// Bring Models into App level to define relationships
// These models implement Sequelize for communicate with database
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

//DEFINE RELATIONSHIP ASSOCIATIONS FOR MODELS
// https://sequelize.org/docs/v6/core-concepts/assocs/
Product.belongsTo(User, { constraints:true, onDelete:'CASCADE' }); 
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem }); // For Many-to-Many Relationships, you need to specify a THROUGH table that joins
Product.belongsToMany(Cart, { through: CartItem }); // For Many-to-Many Relationships, you need to specify a THROUGH table that joins
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through : OrderItem } );

//CREATE MIDDLEWARE TO STORE USER INFORMATION WHEN APP OPENS. ORDER MATTERS FOR OTHER MIDDLEWARE!!!!!
app.use((req, res, next)=>{
    User.findByPk(1)
    .then(user => {
        req.user = user;           //Adds new object 'user' to request body
        next();
    })
    .catch(err=>console.log(err))
})


// ROUTE VARIABLES FOR ESTABLISHING MIDDLEWARE TO HANDLE ROUTES
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// CATCH ALL Middleware for handling any requests not available in app 
// Error must com After All other because it 
const errorController = require('./controllers/error');     //CONTROLLER
app.use(errorController.get404);



// MIDDLEWARE END--------------------------------------------------------------------------------


// APP STARTING POINT ---------------------------------------------------------------------------
// USE SEQUELIZE TO SYNC() MODELS. ONCE MODELS HAVE BEEN SYNCED, DO REMAINDER OF APP FUNCTIONALITY
sequelize
// .sync({force:true})     // Forces Sync to work and potentially create new tables 
.sync()                 // Syncs to mySql Database and CREATES tables If they don't exist
.then(result =>{
   return User.findByPk(1)    // Once tables are synced, you can reach out to tables and grab first User (returns a promise)
})
.then(user => {         // Take the user result, if it exists, move on, if not, create a new user
    if (!user) {
        console.log('There is no user with id of 1')
        return User.create({name: 'Max', email: 'test@test.com'})
    }
    console.log('A user with ID of 1 has been found')
    return Promise.resolve(user);
})
.then(user=>{
    // console.log(user); 
    return user.createCart();   // return a promise for a cart associated to a user
    
}).then(cart => {
    app.listen(3000);   // Tell app to listen to localhost:3000
})
.catch(err=>console.log(err)); 

