const 
	Auction = require('../../models/Auction'),
	BaseController = require('../base.controller');

const CreateController = BaseController.extend({
	async exec(req, res) { 
		let now = new Date();
		let end = new Date();
		end.setHours(now.getHours() + Number(req.body.period));

		const auc = new Auction({
			...req.body,
			startDate: now,
			endDate: end,
			by: req.user.fullname,
			highestBid: req.body.itemPrice
		});

		auc.id = await auc.generateID(8);

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
