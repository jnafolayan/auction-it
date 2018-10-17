const 
	User = require('../../models/User'),
	BaseController = require('../base.controller');

const LoginController = BaseController.extend({
	async exec(req, res, next) {
		let user = await User.findOne({ username: req.body.username });
		if (user) {
			if (user.passwordEqual(req.body.password)) {
				req.session.user = {
					username: user.username,
					fullname: user.fullname
				};
				res.redirect(303, '/auctions');
			} else {
				req.session.flash.loginError = 'Invalid password.';
				res.redirect(303, '/');
			}
		} else {
			req.session.flash.loginError = 'User not found.';
			res.redirect(303, '/');
		}
	}
});

const { router, notAuth, exec } = LoginController;
router.post('/', notAuth, exec);

module.exports = router;
