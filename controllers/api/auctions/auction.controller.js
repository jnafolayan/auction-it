const 
	Auction = require('../../../models/Auction'),
	BaseController = require('../../base.controller');

const AuctionController = BaseController.extend({
	view: 'auction',

	async getContent(req, res, next) {
		let auction = await Auction.findOne({ id: req.params.id });
		return { auction, user: req.user };
	},

	async jsonExec(req, res, next) {
		let data = await this.getContent(req, res, next);
		res.json(data);
	},

	async exec(req, res, next) {
		let data = await this.getContent(req, res, next);

		if (data.auction) 
		{
			data.title = data.auction.item + ' | AuctionIT';
			res.render(this.view, { ...data, hasOwnScripts: true });
		}
		else
			res.redirect('/auctions');
	}
});

const { router, auth, jsonAuth, exec, jsonExec } = AuctionController;

router.get('/:id', auth, exec);
router.post('/:id', jsonAuth, jsonExec);
router.post('/:id/bid', jsonAuth, async (req, res) => {
	let auc = await Auction.findOne({ id: req.params.id });
	let success = await Auction.updateOne({ id: req.params.id }, 
	{ 
		__concat: { 
			bidders: [{ amount: +req.query.amount, by: req.query.by }]
		},
		__set: {
			highestBid: Math.max(+req.query.amount, auc.highestBid)
		}
	});

	if (success)
	{
		res.json({ status: 'success' });
	}
	else
		res.json({ status: 'error' });
});

module.exports = router;
