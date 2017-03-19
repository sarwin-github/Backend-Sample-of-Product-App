var mongoose 	= require('mongoose')
, 	express 	= require('express')
, 	router 		= express.Router()
,	fs 			= require('fs')
,	User 	    = require('../models/user-model.js')
, 	productData = require('../models/product-model.js')
, 	Product 	= mongoose.model('Product');




//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create a product in product collection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.createProductForm = (request, response) => {
	var product = new Product;
	response.render('create-product.ejs', {product:product});
};

exports.createProduct = (request, response) => {
	
	var path = request.files[0].path;
 	var imageName = request.files[0].originalname;
 	var imagepath = {};

	 	imagepath['path'] = path;
	 	imagepath['originalname'] = imageName;
		
	var product = new Product();

	product.name 		= request.body.name;
	product.description = request.body.description;
	product.price 		= request.body.price;
	product.category 	= request.body.category;
	product.subCategory	= request.body.subCategory;
	product.brand 		= request.body.brand;
	//Token temporary disable for testing
	//product.createdBy 	= request.decode.id;
	product.createdBy	= request.body.createdBy;

	product.imagePath	= path;
	product.imageOrgName = imageName;

    product.save((error, product) => {
        
        if (error) {
			
			return response.status(500).send({success: false, error: error, message: 'Something went wrong.'});
		}

		if (!product) {
	
			return response.status(200).send({success: false, message: 'Something went wrong.'});
		}

        response.json({success: true, product: product, message: 'Product Successfully Registered.'});
    });
};


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read a product by using product ID as parameter
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.readProduct = (request, response) => {

	var query = Product.findById({_id: request.params.product_id})
	.select({"__v": 0, "date_updated": 0})

	// Populate who created the product and show ID, email, first name and last name
	.populate('createdBy', ['firstName', 'lastName', 'email']); 

	query.exec((error, product) => {
		
		if (error) {
			
			return response.status(500).send({success: false, error: error, message: 'Something went wrong.'});
		} 

		if (!product) {
		

			return response.status(200).send({success: false, message: 'Product does not exist'});
		}

		var image_data = product.imagePath;
		response.render('product.ejs', {success: true, product: product, image_data: image_data, message: 'Successfully fetched the product.' });
		//response.json({success: true, product: product, message: 'Successfully fetched the product.'});
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read all products in product collection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.readAllProducts = (request, response) => {

	var query = Product.find({})
	.select({"__v": 0, "date_updated": 0})

	// Populate who created the product and show ID, email, first name and last name
	.populate('createdBy', ['firstName', 'lastName', 'email']); 

	query.exec((error, products) => {
		
		if (error) {
			
			return response.status(500).send({success: false, error: error, message: 'Something went wrong.'});
		} 

		if (products.length == 0) {
			
			return response.status(200).send({success: false, message: 'No products registered.'});
		}
		var image_data = products.imagePath;
		response.render('all-product.ejs', {success: true, products: products, image_data: image_data, message: 'Successfully fetched the product.' });
		//response.json({success: true, products: products, message: 'Successfully fetched all product.'});
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read all products created by user id
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.readAllProductsByUserId = (request, response) => {

	var query = Product.find({createdBy: request.decode.id})
	.select({"__v": 0, "dateUpdated": 0})

	// Populate who created the product and show ID, email, first name and last name
	.populate('createdBy', ['firstName', 'lastName', 'email']); 

	query.exec((error, products) => {

		if (error) {
			
			return response.status(500).send({success: false, error: error, message: 'Something went wrong.'});
		}

		if (products.length == 0) {
			
			return response.status(200).send({success: false, message: 'No products registered.'});
		}

		response.json({success: true, products: products, message: 'Successfully fetched all product.'})
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update product in product collection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.updateProduct = (request, response) => {

	var query = Product.findOne({createdBy: request.decode.id, _id: request.params.product_id});

	query.exec((error, product) => {

		if (error) {
			
			return response.status(500).send({success: false, error: error, message: 'Something went wrong.'});
		}

		if (!product) {

			return response.status(200).send({success: false, message: 'Something went wrong.'});
		}

		var path = request.files[0].path;
 		var imageName = request.files[0].originalname;
 		var imagepath = {};

		 	imagepath['path'] = path;
		 	imagepath['originalname'] = imageName;

		 // Update the existing product
	    product.product_name = request.body.productName;
	    product.description = request.body.description;
	    product.category = request.body.category;
	    product.subCategory = request.body.category;
	    product.price = request.body.price;
	    product.brand = request.body.brand;

	    product.imagePath	= path;
		product.imageOrgName = imageName;

	    // Save the product and check for errors 
	    product.save(error => {
	      	
	      	if (error) {

				return response.status(500).send({success: false, error: error, message: 'Something went wrong.'});
			}

	      	response.json({ success: true, product: product, message: 'Product has been updated!' });
	    });
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Delete product in product collection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.deleteProduct = (request, response) => {

	var query = Product.findOneAndRemove({createdBy: request.decode.id, _id: request.params.product_id});

	query.exec((error, product) => {
	
		if (error) {
	
			return response.status(500).send({success: false, error: error, message: 'Something went wrong.'});
		}

		if (!product) {

			return response.status(200).send({success: false, message: 'Something went wrong.'});
		}

		response.json({ success: true, message: 'Product has been removed!' });
	});
};