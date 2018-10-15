"use strict";

const
	path = require('path'),
	morgan = require('morgan'),
	hbs = require('express-hbs'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	db = require('./db'),
	express = require('express'),
	app = express(),

	controllers = require('./controllers');

const SECRET = 'auctionit!';

const hbsEngine = hbs.express4({
	viewsDir: path.join(__dirname, 'views'),
	layoutsDir: path.resolve(__dirname, 'views', 'layouts'),
	partialDir: path.resolve(__dirname, 'views', 'partials'),
	defaultLayout: path.resolve( __dirname, 'views', 'layouts', 'default'),
	extname: '.hbs',
	helpers: {
		section: function(name, options) {
			if (!this._sections)
				this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		}
	}
});

app.engine('hbs', hbsEngine);

app.set('view engine', 'hbs');

// app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(SECRET));
app.use(session({ 
	secret: SECRET,
	saveUninitialized: true,
	resave: true,
	cookie: { httpOnly: true, signed: true }
}));
app.use((req, res, next) => {
	res.locals.flash = req.session.flash || {};
	req.session.flash = {};
	req.user = req.session.user;
	next();
});

db.connect();

app.use((req, res, next) => {
	req.isAuth = () => !!req.session.user;
	req.logout = () => {
		delete req.session.user;
	};
	next();
});

controllers.initialize(app);

app.listen(3000, () => console.log('Server running at localhost:3000'));
