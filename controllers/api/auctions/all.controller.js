const 
	Auction = require('../../../models/Auction'),
	BaseController = require('../../base.controller');

const AllController = BaseController.extend({
	async getContent(req, res, next) {
		let auctions = await Auction.find({});

		return { user: req.user, auctions };
	},

	async exec(req, res, next) {
		let data = await this.getContent(req, res, next);
		res.json(data);
	}
});

const { router, jsonAuth, exec } = AllController;

router.get('/', jsonAuth, exec);

module.exports = router;
