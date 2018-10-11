"use strict";

const
	morgan = require('morgan'),
	express = require('express'),
	app = express();

const handlebars = require('express3-handlebars')
	.create({ 
		defaultLayout: 'main',
		helpers: {
			section: function(name, options) {
				if (!this._sections)
					this._sections = {};
				this._sections[name] = options.fn(this);
				return null;
			}
		}
	});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

require('./api')(app);
require('./routes')(app);

app.listen(3000, () => console.log('Server running at localhost:3000'));
