var express 	= require('express')
, 	mongoose 	= require('mongoose')
, 	bodyParser 	= require('body-parser')
, 	multer 		= require('multer')  
, 	http 		= require('http')
, 	path 		= require('path') ;

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set Environmental Variable
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
process.env.PORT = process.env.PORT || 8080;
process.env.KEY = 'auction-secret-key';
process.env.ADMIN_KEY = 'auction-admin-key';
process.env.DATABASE = 'mongodb://localhost:27017/token2';

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Multer set uploaded image destination 
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, './public/images')},
  filename: (request, file, callback) => {
    callback(null, file.originalname);
}});

var upload = multer({ storage: storage });

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set Mongoose Connection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var mongoConnectionLocal  = 'mongodb://localhost:27017/token'
, 	mongoConnectionOnline = 'mongodb://sarwinadmin:a67e62d399330e4a889bda5350d90198a1bc90efd2c1470b584674f12e406cd0@ds129179.mlab.com:29179/auction-db2';

mongoose.Promise = global.Promise;
mongoose.connect(mongoConnectionLocal, (error, database) => { if(error) { console.log(error); }});
asdasd
var app = express();
dfsdfsdf
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set controllers
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var userController 	  = require('./app/controllers/user-controller')
, 	productController = require('./app/controllers/product-controller')
, 	authController 	  = require('./app/controllers/authentication-controller')
,	orderController	  = require('./app/controllers/order-controller');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Parser middleware
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/node_modules'));
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set folder directories
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.set('views', __dirname + '/app/views');
//app.set('partials', __dirname + '/views/partials');
app.set('view engine', 'ejs');

var router = express.Router();


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ROUTE FORMAT
// model/verb/noun - |user/update/profile|
// 		model - should be model name (i.e. user model, order model, etc)
// 		verb  - should be controller action (i.e. update, delete, show, etc)
//		noun  - is like a pointer to verb on which is being modified
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set public routes ----------(ALL ROUTES CHECKED)-----------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	// Routes for authentication - Initial Screen Login - Go to Login Screen
	router.route('/login')
		  .post(authController.authenticate);

	// Check if user is Authenticated - HTTPGet (but use HTTPPost for testing to provide JWT token)
	router.route('/check/authentication')
		  .get(authController.checkAuthentication);

	// Create a user - "A user with role as iPOS user"
	router.route('/user/create')
		  .post(userController.createIPOSUser);

	// Create an admin - "a user with role as iPOS admin"
	router.route('/admin/create')
		  .post(authController.checkTheAdminKey, userController.createIPOSAdmin);


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set restricted routes for iPOS Users ----------(ALL ROUTES CHECKED)-----------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	// Read user by id - HTTPGet (but use HTTPPost for testing)
	router.route('/user/show/profile')
		  .get(authController.checkTheToken, userController.readIPOSUser);

	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// EVERY USER UPDATE WILL CREATE A NEW HASH FOR PASSWORD 
	//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		// Update IPOS user profile
		router.route('/user/update/profile')
			  .put(authController.checkTheToken, userController.updateIPOSUser);
		// Update IPOS user password
		router.route('/user/update/password')
			  .put(authController.checkTheToken, userController.updateIPOSUserPassword);

	// Read all products created by this logged in IPOS User
	router.route('/user/show/products')
		  .post(authController.checkTheToken, authController.checkIfIPOSUser, productController.readAllProductsByUserId);


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set restricted routes for products
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	// Show the initial page for creating a product
	router.route('/product/create')
		  .get(/* authController.checkTheToken,  authController.checkIfIPOSUser,*/productController.createProductForm);

	/* Create a product - For uploading image check token is temporarily disabled 
	   Execute post after the submit button was clicked on /product/create - GET
	   Upload.any() is the function to save the requested.files using multer */
	router.route('/product/create') 
		  .post(/*authController.checkTheToken, authController.checkIfIPOSUser,*/ upload.any(), productController.createProduct);


	// Get all products - Show all products after successful logged in
	router.route('/product/show/all')
		  .get(/* authController.checkTheToken,  authController.checkIfIPOSUser,*/productController.readAllProducts);

	// Read a product 
	router.route('/product/show/:product_id')
		  .get(/* authController.checkTheToken, authController.checkIfIPOSUser,*/productController.readProduct);

	// Update a product by product id as a parameter
	router.route('/product/update/:product_id')
		  .put(authController.checkTheToken, /* authController.checkIfIPOSUser,*/productController.updateProduct);

	// Delete product by product id as a parameter
	router.route('/product/delete/:product_id')
		  .delete(authController.checkTheToken, /* authController.checkIfIPOSUser,*/productController.deleteProduct);



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set restricted routes for Orders ----------(ALL ROUTES CHECKED)-----------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// Create an order for the logged in user - "A user with role as iPOS user"
	router.route('/order/create') 
		  .post(authController.checkTheToken, /*authController.checkIfIPOSUser,*/ orderController.createOrder);

	// Read all orders 
	router.route('/order/show/all') 
		  .post(authController.checkTheToken, /*authController.checkIfIPOSUser,*/ orderController.readAllOrders);

	// Delete an order using order_id as parameter
	router.route('/order/delete/:order_id') 
		  .delete(authController.checkTheToken, /*authController.checkIfIPOSUser,*/ orderController.deleteOrder);
		

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set restricted routes for admin ----------(ALL ROUTES CHECKED)-----------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	// Read all users 
	// Authentication is not yet assigned for testing purposes
	router.route('/admin/show/all/users')
		  .get(/*authController.checkTheToken, authController.checkIfIPOSAdmin,*/ userController.readAllUsers);

	// Delete IPOS-user by user id as a parameter
	router.route('/admin/delete/user/:user_id')
		  .delete(authController.checkTheToken, authController.checkIfIPOSAdmin, userController.deleteUser);

	// Update IPOS-admin profile
	router.route('/admin/update/profile')
		  .put(authController.checkTheToken, authController.checkIfIPOSAdmin, userController.updateIPOSUser);


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set initial route for root
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// use '/' for the end points
app.use('/', router);

app.get('/', function (req, res) {
	res.send('API is at http://localhost' + process.env.PORT + '/');
	// res.sendFile(__dirname + '/app/views/index.html');
});


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Start server
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.listen(process.env.PORT, function () {
		console.log('Server listening on port: '+ process.env.PORT);
});