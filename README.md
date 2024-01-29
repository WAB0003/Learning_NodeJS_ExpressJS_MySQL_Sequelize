# Learning_NodeJS_ExpressJS_MySQL_Sequelize
## Definitions:
- **Node.js**
  - a runtime environment for building server-side and networking applications
- **Express.js**
  - Node.js web application framework
  - Great for building out 'routes' for API
- **Sequelize.js**
  - A good ORM (Object Relational Mapper) for working with sql databases
- **MVC**
  - Model View Controller - A pattern in software design commonly used
- **Templating Engine**
  - EJS, PUG, etc...
  - Allows you to use placeholders for dynamic content that will be replaced with actual data when a page is rendered

## Initial Setup of a express application
1. Create a npm project and install Express.js (nodemon if you want)
    - run npm init to initialize npm project and get package.json file
    - run npm install --save-dev nodemon to get nodemon package
    - run npm install express
    - run npm install body-parser
    - run npm install ejs

    Once all dependenices have been installed, update 'start' script in package.json file
        "start": "nodemon app.js"
    run npm install and then use npm start to start connection to server

    Once setup is complete, create app.js file and bring in desired CORE modules, NPM modules, and connect to express server

    Set global configuration values for dealing with static css documents and EJS

    Use body-parser as a Middleware that parses incoming request data before they get sent to Handlers

2. Transform app to an Express.js app and set up routing:
    - Create a routes directory for handlers
    - In handler JS files, do the following:
        - path core modules
        - bring in express
        - create router Object using express.router
        - user Router Object to create routes for different requests (get, posts, etc.)
        - use res.render() to render an EJS page. 
