var mongoose = require('mongoose')
, 	Schema   = mongoose.Schema;


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set Product Schema
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var productSchema = new mongoose.Schema({
	
	createdBy		: {type: Schema.Types.ObjectId, ref: 'User' /*, required: true*/},

	dateCreated		: {type: Date, default: Date.now},
	dateUpdated		: Date, // Everytime a product is updated get Date

	name			: { type: String, required: [true, 'Product name is required'] }, // Contain the product name
	description		: { type: String, required: [true, 'Description is required'] }, // Contain the product description
	price			: { type: Number, required: [true, 'Price is required'] }, // Contain the product price
	category		: { type: String, required: [true, 'Category is required'] }, // Contain the product category
	subCategory		: String, // Contain the product sub category

	brand			: String, // Contain the product brand
	imagePath		: String,
	imageOrgName	: String

		/* 
		   createdBy: ObjID(3123124256666e)

		   date_created: July something
		   date_updated: August Something

		   product_name: Amazing Spider-man Game
		   description : Amazing Spider-man Game with 100% save file and unlocked weapons and skills
		   price: 600
		   brand: EA Games
		   category: Entertainment
		*/
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update the date before saving to database
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
productSchema.pre('save', function(next){
	
	var now = new Date();
	
	this.dateUpdated = now;
	
	next();
}); 

// Export the Mongoose model
var Product = mongoose.model('Product', productSchema);


