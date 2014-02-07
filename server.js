var express = require('express');
var app = express();
var qs = require('qs');
var url = require('url');
var path = require('path');
var fs = require('fs');
var Firebase = require('firebase');
var adRef = new Firebase('https://taehwanjo.firebaseio.com/brochure/');

app.use('/', express.static('public/', __dirname));

app.use(express.bodyParser());

app.post('/post/:username/:section', function(req, res){
	adRef.child(req.params.username).child(req.params.section).set(req.body.value);
});

app.post('/upload/:username', function(req, res){ 
	var username = req.params.username;
	fs.readFile(req.files.displayImage.path, function(err,data) {
		var newPath = __dirname + "/public/imageuploads/" + username;
		console.log('shit is gonna get saved to:', newPath);
		adRef.child(username).child('photo').set(1, function(){
			fs.writeFile(newPath, data, function(err) { //this is callback INSIDE of firebase update
				res.redirect('back');
			});
		});
	});
});

app.listen(3000);
console.log('Listening on port 3000');