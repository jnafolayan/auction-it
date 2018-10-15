const 
	Auction = require('../../models/Auction'),
	BaseController = require('../base.controller');

const AllController = BaseController.extend({
	view: 'auctions',

	async getContent(req, res, next) {
		let all = await Auction.find({});
		let activeAuctions = all.filter(auc => auc.bidders.includes(req.user) || auc.by === req.user);

		return { title: 'Auctions', auctions: all, activeAuctions };
	},

	async exec(req, res, next) {
		let data = await this.getContent(req, res, next);
		res.render(this.view, data);
	}
});

const { router, auth, exec } = AllController;

router.get('/', auth, exec);

module.exports = router;
