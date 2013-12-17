var express = require('express');
var app = express.createServer();
var qs = require('qs');
var url = require('url');
var path = require('path');
var fs = require('fs');
var Firebase = require('firebase');
var username = "test_username";
var adRef = new Firebase('https://taehwanjo.firebaseio.com/brochure/');

console.log('serving static files from: ', __dirname);


app.use('/', express.static('public/', __dirname));

app.use(express.bodyParser());

app.post('/post/:section', function(req, res){
	adRef.child(req.params.section).set(req.body.value);
});

app.post('/upload', function(req, res){ 
	console.log(req.files);
	fs.readFile(req.files.displayImage.path, function(err,data) {
		var newPath = __dirname + "/public/imageuploads/" + username;
		console.log('shit is gonna get saved to:', newPath);
		adRef.child('photo').set(1, function(){
			fs.writeFile(newPath, data, function(err) { //this is callback INSIDE of firebase update
				res.redirect('back');
			});
		});
	});

	// var tempPath = ;
	// var targetPath = path.resolve('/.uploads/image.png');
	// console.log("tempPath is: ", tempPath);
});


app.listen(3000);
console.log('Listening on port 3000');


//inside here, if a POST request is made, I have 
//to send request to firebase

