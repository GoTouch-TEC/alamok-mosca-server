var axios = require('axios');
class LoopbackClient {
	
	constructor (host,user,password){
		
		this._host = host;
		this._user = user;
		this._password = password;
		console.log("Creating Client ", this._host,this._user,this._password);
	}

	set host(host) {
    	this._host = host;
  	}
    get host() {
    	return this._host;
    }

    set user(user) {
    	this._user = user;
  	}
    get user() {
    	return this._user;
    }

    set password(password) {
    	this._password = password;
  	}
    get password() {
    	return this._password;
    }

    set token(token) {
    	this._token = token;
  	}
    get token() {
    	return this._token;
    }

    login (){
    	var owner =this;
    	return new Promise((resolve, reject) => {
  			axios.post(this._host+'/api/AlamokUsers/login',{'username':'mqttpub','password':'mqttpub' })
			.then(
		  		function(data){
		    	owner._token =data.data.id;
		    	console.log('Data Login Loopback',owner._token);
		    	resolve(data.data.id);
			})
			.catch(function(error){console.log('Error Login Looback', error);
				reject("null")});
		});	
    }

    logout (){
    	
    }


    post(body,uri,successCallback,errorCallback){
		axios({ 
	    	method: 'POST', 
			//http://13.59.16.98:3000 = host
			// '/api/Locations' = uri
			url: this._host+uri, 	      
			headers: {autorizacion: this._token}, 
			data: body})
			.then(successCallback)
			.catch(errorCallback);
	}
    

    	
    
}
module.exports = LoopbackClient;



/*var loopbackClient = new LoopbackClient(
	'http://13.59.16.98:3000','mqttpub','mqttpub');


loopbackClient.login().then(function(data){
	console.log("Token on client",data);
	loopbackClient.post({
  		"latitude": 0,
		"longitude": 0,
		"date": "2018-05-20T01:23:21.571Z",
		"speed": 0,
		"altitude": 0,
		"value": {},
		"topic": "options",
		"options": {},
		"deviceId": "string"
	},'/api/Locations',
	function(data){
		console.log('POST ','OK');
	},
	function(error){
		console.log('POST','NOT OK');
	});
});
*/