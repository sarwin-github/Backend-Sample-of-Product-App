var mongoose = require('mongoose')
, userData	 = require('../models/user-model.js')
, Address 	 = mongoose.model('Address')
, User 		 = mongoose.model('User')
, jwt 		 = require('jsonwebtoken');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read user in user collection ------------------------------- Show the profile of the logged in user -----------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.readIPOSUser = (request, response) => {	
	var query = User.findById({_id: request.decode.id}).select({"__v": 0, "password": 0});

	query.exec((error, user) => {
		if (error) {
			return response.status(500).send({success: false, error: error, message: 'Something went wrong'});
		}
		if (!user) {
		
			return response.status(200).send({success: false, message: 'User does not exist'});
		}
		response.json({success: true, user: user, message: 'Successfully fetched user profile'})
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update any user in collection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.updateIPOSUser = (request, response) => {
	var query = User.findById({_id: request.decode.id});
	
	query.exec((error, user) => {	    
	    if (error) {		
			return response.status(500).send({success: false, error: error, message: 'Something went wrong'});
		}

		if (!user) {		
			return response.status(200).send({success: false, message: 'Something went wrong'});
		}

		var address = Address();
		
		// Set Account Properties for updating user account details
	    user.firstName  = 	request.body.firstName;
	    user.lastName 	= 	request.body.lastName;
	    user.birthdate 	= 	request.body.birthdate;
	    user.age 		= 	request.body.age;
	  
	    // Set Account Properties for account address 
	    address.street 	=	request.body.street;
	    address.city    =	request.body.city;
	    address.state   =	request.body.state;
	    address.country =	request.body.country;
	    address.zip     = 	request.body.zip;

	    // Save the product and check for errors 
	    user.save(error => {	     	
	     	if (error) {			
				return response.status(500).send({success: false, error: error, message: 'Something went wrong'});
			}

	      	response.json({ success: true, user: user, message: 'User account has been updated!' });
	    });
  	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update user password in user collection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.updateIPOSUserPassword = (request, response) => {
	var query = User.findById({_id: request.decode.id})
	
	query.exec((error, user) => {
	    
	    if (error) {			
			return response.status(500).send({success: false, error: error, message: 'Something went wrong'});
		}

		if (!user) {		
			return response.status(200).send({success: false, message: 'Something went wrong'});
		}

		// Set Account Properties for updating user password 
		user.password =	request.body.password;

	    // Save the product and check for errors 
	    user.save(error => {	     	
	     	if (error) {			
				return response.status(500).send({success: false, error: error, message: 'Something went wrong'});
			}

	      	response.json({ success: true, user: user, message: 'User account has been updated!' });
	    });
  	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create a bidder in user collection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.createIPOSUser = (request, response) => {

	// Set Address Properties 
	var address = new Address();

	address.street		  =		request.body.street;
	address.city		  =		request.body.city;
	address.state		  =		request.body.state;
	address.country		  =		request.body.country;
	address.zip		  	  =		request.body.zip;

	var user = new User();
 
	// Set Account Properties for adding new user account details 
	user.role		  	  =		'ipos-user';
    user.email 		  	  = 	request.body.email;
	user.username 	  	  = 	request.body.username;
	user.password 	  	  = 	request.body.password;
   	user.firstName    	  = 	request.body.firstName;
    user.lastName 	  	  = 	request.body.lastName;
    user.birthdate 	  	  = 	request.body.birthdate;
    user.age 		  	  = 	request.body.age;
    user.address      	  = 	address;

    user.save((error, user) => {    
        if (error) {
			return response.status(500).send({success: false, error: error, message: 'Something went wrong'});
		}
		response.json({success: true, message: 'Successfully Registered'});
    });
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create an admin in user collection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.createIPOSAdmin = (request, response) => {	
	// Set Address Properties 
	var address = new Address();

	address.street		  =		request.body.street;
	address.city		  =		request.body.city;
	address.state		  =		request.body.state;
	address.country		  =		request.body.country;
	address.zip		  	  =		request.body.zip;

	var user = new User();
 
	// Set Account Properties for adding new user account details 
	user.role		  	  =		'ipos-admin';
    user.email 		  	  = 	request.body.email;
	user.username 	  	  = 	request.body.username;
	user.password 	  	  = 	request.body.password;
   	user.firstName    	  = 	request.body.firstName;
    user.lastName 	  	  = 	request.body.lastName;
    user.birthdate 	  	  = 	request.body.birthdate;
    user.age 		  	  = 	request.body.age;
    user.address      	  = 	address;

    user.save((error, user) => {
    
        if (error) {
			return response.status(500).send({success: false, error: error, message: 'Something went wrong'});
		}
		response.json({success: true, message: 'Successfully Registered'});
    });
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Admin restricted functions
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Read all users in user collection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.readAllUsers = (request, response) => {	
	var query = User.find({}).select({"__v": 0, "password": 0, "userAddress._id": 0});

	query.exec((error, users) => {		
		if (error) {			
			return response.status(500).send({success: false, error: error, message: 'Something went wrong'});
		}

		if (!users) {			
			return response.status(200).send({success: false, message: 'No users registered'});
		}

		response.json({success: true, users: users, message: 'Successfully fetched all user'})
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Delete user in user collection
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.deleteUser = (request, response) => {
	var query = User.findByIdAndRemove({_id: request.params.user_id});

	query.exec((error, user) => {		
		if (error) {		
			return response.status(500).send({success: false, error: error, message: 'Something went wrong.'});
		}

		if (!user) {		
			return response.status(200).send({success: false, message: 'Something went wrong.'});
		}

		response.json({success: true, message: 'User has been removed!'});
	});
};
