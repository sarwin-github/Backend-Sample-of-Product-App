var mongoose 	= require('mongoose')
,	User 	    = require('../models/user-model.js')
, 	orderData 	= require('../models/order-model.js')
, 	Order 		= mongoose.model('Order');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create a orders in order collection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.createOrder = (request, response) => {
	var order = new Order();

	order.orderedProducts 	= request.body.orderedProducts;
	order.totalPrice 		= request.body.totalPrice;
	order.createdBy 		= request.decode.id;

    order.save((error, orders) => {
        if (error) {
			
			return response.status(500).send({success: false, error: error, message: 'Something went wrong.'});
		}
		if (!orders) {	
			return response.status(200).send({success: false, message: 'Something went wrong.'});
		}
        response.json({success: true, orders: orders, message: 'Order Successfully Registered.'});
    });
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read all orders in order collection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.readAllOrders = (request, response) => {
	var query = Order.find({})
	.select({"__v": 0, "date_updated": 0})

	// Populate who created the product and show ID, email, first name and last name
	.populate('createdBy', ['firstName', 'lastName', 'email'])
	.populate('orderedProducts', ['name', 'description', 'price']); 

	query.exec((error, orders) => {		
		if (error) {			
			return response.status(500).send({success: false, error: error, message: 'Something went wrong.'});
		} 

		if (orders.length == 0) {			
			return response.status(200).send({success: false, message: 'No orders registered.'});
		}

		//response.render('index.ejs', { success: true, products: products, message: 'Successfully fetched all product.'});
		response.json({success: true, orders: orders, message: 'Successfully fetched all orders.'})
	});
};


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Delete order in order collection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.deleteOrder = (request, response) => {
	var query = Order.findOneAndRemove({createdBy: request.decode.id, _id: request.params.order_id});

	query.exec((error, order) => {
		if (error) {	
			return response.status(500).send({success: false, error: error, message: 'Something went wrong.'});
		}

		if (!order) {
			return response.status(200).send({success: false, message: 'Something went wrong.'});
		}

		response.json({ success: true, message: 'Order has been removed!' });
	});
};