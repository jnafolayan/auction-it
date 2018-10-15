exports.initialize = (app) => {
	app.use('/', require('./home.controller'));
	app.get('/logout', (req, res) => { req.logout(); res.redirect('/'); });
	app.use('/auth', require('./auth'));
	app.use('/auctions', require('./auctions'));
};