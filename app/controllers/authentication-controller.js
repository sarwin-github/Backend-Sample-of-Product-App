var userData = require('../models/user-model.js')
,	mongoose = require('mongoose')
, 	User 	 = mongoose.model('User')
, 	jwt 	 = require('jsonwebtoken');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Authenticate user
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.authenticate = (request, response) => {
	
	var query = User.findOne({username: request.body.username});

	query.exec((error, user) => {
		
		if (error) {
			
			return response.status(500).send({success: false, error: error, message: 'Something went wrong'});
		}
		
		if (!user) {
			
			return response.status(200).send({success: false, message: 'User does not exist'});
		} 
		else {
			
			var validPassword = user.comparePassword(request.body.password);

			if (!validPassword) {
				
				return response.status(200).send({success: false, message: 'Invalid password'});
			} 
			else {
				
				var token = jwt.sign({id: user.id, role: user.role}, process.env.KEY, {expiresIn: 4000});
        	
        		response.json({success: true, user: user, token: token, message: 'Authentication successful'});
			}
		}
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Check authentication
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.checkAuthentication = (request, response) => {

	var token = request.body.token || request.param('token') || request.headers['token'] || undefined;

	jwt.verify(token, process.env.KEY, function (error, decode) {
		
		if (error) {

			return response.status(401).send({success: false, error: error, message: 'Unauthorized'});
		} 
		else {
			
        	response.json({success: true, message: 'Authenticate'});
		}
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Authorization middlewares
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Check the token if valid
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.checkTheToken = (request, response, next) => {

	var token = request.body.token || request.param('token') || request.headers['token'] || undefined;

	jwt.verify(token, process.env.KEY, function (error, decode) {
		
		if (error) {

			return response.status(401).send({success: false, message: 'Unauthorized'});
		} 
		else {
			
			request.decode = decode;
			next();
		}
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Check the admin key if valid
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.checkTheAdminKey = (request, response, next) => {

	var adminKey = request.body.adminKey;

	if (adminKey != process.env.ADMIN_KEY || adminKey == undefined) {

		return response.status(401).send({success: false, message: 'Unauthorized'});
	} 
	else {

		next();
	}
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Check if user is an ipos-admin
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.checkIfIPOSAdmin = (request, response, next) => {

	if (request.decode.role == 'ipos-admin') {

		next();
	} 
	else {

		return response.status(401).send({success: false, message: 'Unauthorized'});
	}
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Check if user is a ipos-user
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.checkIfIPOSUser = function (request, response, next) {

	if (request.decode.role == 'ipos-user') {

		next();
	} 
	else {
	
		return response.status(401).send({success: false, message: 'Unauthorized'});
	}
};