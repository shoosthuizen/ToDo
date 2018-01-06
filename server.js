// set up

var express = require('express'); // create our app with express
var app = express(); 
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan'); // log requests to console 
var bodyParser = require('body-parser'); // pull information from HTML POST
var methodOverride = require('method-override'); // simulate DELETE and PUT


// configuration

mongoose.connect('mongodb://127.0.0.1/ToDo');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

// define model
var Todo = mongoose.model('todos', { 
	text: String
});

// listen (start app with node server.js)
app.listen(8080);
console.log("App listening on port 8080");

// routes
// get all todos
app.get('/api/todos', function(req, res) {

	// use mongoose to get all todos in the database
	Todo.find(function(err, todos) {
		// if there is an error retrieving, send the error
		if (err)
			res.send(err)

		res.json(todos);
	});
});

// create todo and send back all the todos after creation
app.post('/api/todos', function(req, res) {

	// create a todo, information comes from ajax request from Angular
	Todo.create({
		text: req.body.text,
		done: false
	}, function(err, todo) {
		if (err)
			res.send(err);

		// get and return all the todos after you create another
		Todo.find(function(err, todos) {
			if (err)
				res.send(err)
			res.json(todos);
		});
	});

});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
	Todo.remove({ 

	}, function(err, todo) {
		if(err)
			res.send(err);

		// get and return all the todos after you create another
		Todo.find(function(err, todos) {
			if (err) 
				res.send(err)
			res.json(todos);
		});
	});
});

// application
app.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});
