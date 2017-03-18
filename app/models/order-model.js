var mongoose = require('mongoose')
, 	Schema   = mongoose.Schema;


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set Order Schema
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var orderSchema = new mongoose.Schema({
	createdBy		: { type: Schema.Types.ObjectId, ref: 'User', required: true},
	dateCreated		: {type: Date, default: Date.now},
	dateUpdated		: Date, // Everytime a product is updated get Date
	orderedProducts	: [{ type: Schema.Types.ObjectId, ref: 'Product' , required: true}], // Contain the product name
	totalPrice		: { type: String, required: [true, 'Description is required'] } // Contain total price of orders
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update the date before saving to database
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
orderSchema.pre('save', function(next){
	var now = new Date();
	this.dateUpdated = now;
	next();
}); 

// Export the Mongoose model
var Order = mongoose.model('Order', orderSchema);


