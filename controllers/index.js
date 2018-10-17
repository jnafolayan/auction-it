exports.initialize = (app) => {
	app.use('/', require('./home.controller'));
	app.get('/logout', (req, res) => { req.logout(); res.redirect('/'); });
	app.use('/api', require('./api'));
	app.use('/auth', require('./auth'));
	app.use('/auctions', require('./auctions'));
	app.use('/auction', require('./api/auctions/auction.controller'));
};