var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');
var app = express();

var tweets_res = '';

mongoose.connect('mongodb://heroku_d89gnspb:chno8n355pj8un9jjmlpglu231@ds027385.mongolab.com:27385/heroku_d89gnspb');


app.use(bodyParser());

app.set('port', (process.env.PORT || 5000));


app.get('/', function (request, response) {

  response.send("Hello, testing... :)");

});

app.get('/mongoose', function (request, response) {
	
	var schema = mongoose.Schema({
		name: String
	});

	var x = mongoose.model('names',schema);

	var person = new x();
	person.name = "Suraj";
	person.save(function(err){
		if(err)
			console.log('Error Error!!');
		else
			console.log('Data saved!!');

	});

	response.send("Data saved!!");

});

app.get('/tweets', function (request, response){

	var tweet_msg = '';
 
	var client = new Twitter({
	  consumer_key: 'jxnqynJxmIV6tdPfcYg4hlII4',
	  consumer_secret: 'I7WsmZoSjfJAoyKR0EZuhen26hCI36AiV9rkyc2xmgrfIx0Vlb',
	  access_token_key: '97393662-TDgbHRNjkCkXZnRoGeyCz32kgjN6UwyetMQ258h5E',
	  access_token_secret: 'y35T8LKMu2JDF6n5eY3VpOZjlMrFkkxWwkum1yGpjtUx8'
	});
 
	var params = {count: '5',screen_name: '_surajjana'};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	  if (!error) {
	  	tweets_res = tweets;
	  	//var res = JSON.parse(tweets_res);
	  	
	  	for(var i=0;i<5;i++){
	  		//console.log("Message : "+tweets[i].text+"\n");
	  		tweet_msg += tweets[i].text + ' ';
	  	}
	  	console.log(tweet_msg);
	    //response.send(JSON.stringify(tweets, null, 4));
	  }
	});
	//response.send(JSON.stringify(tweets_res, null, 4));
	response.send("1");
});

app.get('/sentiment', function (req, res){
	//var msg = req.body['msg'];
	var msg = 'i m in good mood';
	request("https://api.havenondemand.com/1/api/sync/analyzesentiment/v1?text="+msg+"&apikey=4c517421-8409-4a33-8b20-cf547c587cf3", function(error, response, body) {
	  var res = body;
	  var a = JSON.parse(res);
	  console.log(a.aggregate.score);
	  response.send(a.aggregate.score);
	});
	//res.send(result);
});

app.get('/read_mongoose',function (request, response){

	var schema = mongoose.Schema({
		name: String
	});

	var x = mongoose.model('x',schema);

	x.find(function (err, names){
		if(err) return console.error(err);
		response.send(names);
	});

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});