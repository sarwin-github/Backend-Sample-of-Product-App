var mongoose = require('mongoose')
, 	bcrypt 	 = require('bcrypt-nodejs')
, 	Schema 	 = mongoose.Schema;

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Regex for email validation
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var validateEmail = function(email) {
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Set string length for password and username
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// SHARED VALIDATION USERNAME FUNCTIONS
	var usernameValidation = (string) => {
	  return string && string.length >= 5;
	};

	// SHARED VALIDATION PASSWORD FUNCTIONS
	var passwordValidation = (string) => {
	  return string && string.length >= 5;
	};

	// var validateLength = [isNotTooShort, 'Too short' ];
	var usernameLengthValidate = [{validator: usernameValidation, msg: 'Username should contain atleast 5 characters'} ];
	var passwordLengthValidate = [{validator: passwordValidation, msg: 'Password should contain atleast 8 characters'} ];


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set Address
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var addressSchema = new mongoose.Schema({
	street			: { type: String, required: [true, 'Street address is required']}, // Contain the street address 
	city			: String, // Contain City, it is not always required such as province (i.e. Lucban Quezon)
	state 			: { type: String, required: [true, 'State/Province is required']}, // Contain province or state
	country 		: { type: String, required: [true, 'Country name is required']}, // Contains the name of the country
	zip 			: { type: String, required: [true, 'ZIP Code is required']},  // Contain ZIP code 
},{ _id : false }); //Stop generating id

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Set User Schema
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var userSchema = new mongoose.Schema({
	username    	: { type: String, 
						unique: [true, 'Username is already taken'], 
						required: [true, 'Username is required'], 
						validate: usernameLengthValidate }, // username minimum character should be 6

	password    	: { type: String, 
						required: [true, 'Password is required'], 
						validate: passwordLengthValidate}, // hash created from password

	role			: { type: String, required: true }, // Shall be assign by admin initial role will be as a user
  	firstName		: { type: String, required: [true, 'First name is required']}, // Contain the first name of the account user
  	lastName		: { type: String, required: [true, 'Last name is required']}, // Contain the last name of the account user
  	birthdate		: { type: Date, required: [true, 'Birthday is required']}, // Contain the date of birth
  	age				: { type: Number, required: [true, 'Age is required']}, // Contain the age of the account user
  	email 			: { type: String, trim: true, lowercase: true, // Contain the email of the user with email validation/regex
		        		unique: true, required: [true, 'Email address is required'],
		        		validate: [validateEmail, 'Please fill a valid email address'],
		        		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']}, // Contain the email of the account
	
	address			: addressSchema, // Contain the address of the user from Address schema
	dateCreated		: {type: Date, default: Date.now},
	dateUpdated		: Date 
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Hash password before saving to database
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
userSchema.pre('save', function (next) {

	var user = this;

	if (!user.isModified('password')) {
		return next();
	}

	bcrypt.hash(user.password, null, null, function (error, hash){
		
		if (error) {
			return next(error);
		}
		
		user.password = hash;
		next();
	});
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update the date before saving to database
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
userSchema.pre('save', function(next){
	
	var now = new Date();
	
	this.dateUpdated = now;
	
	next();
}); 

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Compare password to the hash
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
userSchema.methods.comparePassword = function (password) {
	
	var user = this;
	
	return bcrypt.compareSync(password, user.password);
}

// Export the Mongoose model
var Address = mongoose.model('Address', addressSchema);
var User 	= mongoose.model('User', userSchema);
