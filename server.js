var express = require('express');
var app = express.createServer();
var qs = require('qs');
var url = require('url');
var Firebase = require('firebase');
var userid = "test_username";
var adRef = new Firebase('https://taehwanjo.firebaseio.com/brochure/' + userid);

console.log('serving static files from: ', __dirname);


app.use('/', express.static('public/', __dirname));

app.use(express.bodyParser());

app.post('/post/:section', function(req, res){
	adRef.child(req.params.section).set(req.body.value);
});


app.listen(3000);
console.log('Listening on port 3000');


//inside here, if a POST request is made, I have 
//to send request to firebase

