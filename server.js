"use strict";

const 
	morgan = require('morgan'),
	express = require('express'),
	app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

require('./api')(app);

app.listen(3000, () => console.log('Server running at localhost:3000'));
