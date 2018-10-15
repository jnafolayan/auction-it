const 
	Auction = require('../../models/Auction'),
	BaseController = require('../base.controller');

const CreateController = BaseController.extend({
	async exec(req, res) {
		const auc = new Auction(req.body);
		auc.by = req.user;
		let success = await auc.save();
		if (success) {
			res.redirect(303, '/auctions');
		} else {
			// nothing
		}
	}
});

const { router, auth, exec } = CreateController;

router.post('/', auth, exec);

module.exports = router;
