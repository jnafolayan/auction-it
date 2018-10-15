const 
	User = require('../../models/User'),
	BaseController = require('../base.controller');

const LoginController = BaseController.extend({
	async exec(req, res, next) {
		let exists = await User.exists(req.body.username);

		if (exists) {
			let suggested = '';
			let names = req.body.fullname.split(' ');

			while (exists) {
				if (Math.random() < 0.5)
					suggested = names[Math.random() * names.length | 0].toLowerCase();
				else 
					suggested = names.join('');

				if (Math.random() < 0.5)
					suggested = Math.floor(Math.random() * 20) + suggested;
				else 
					suggested += Math.floor(Math.random() * 20);

				exists = await User.exists(suggested);
			}

			req.session.flash.signupError = 'The username is taken. Try ' + suggested;
			res.redirect(303, '/');
		} else {
			let newUser = new User(req.body);
			let success = await newUser.save();
			if (success) {
				req.session.user = req.body.username;
				res.redirect(303, '/auctions');
			} else {
				req.session.flash.signupError = 'Couldn\'t create user profile';
				res.redirect(303, '/');
			}
		}
	}
});

const { router, notAuth, exec } = LoginController;
router.post('/', notAuth, exec);

module.exports = router;
