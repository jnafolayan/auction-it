const 
	Auction = require('../../models/Auction'),
	BaseController = require('../base.controller');

const AllController = BaseController.extend({
	view: 'auctions',

	exec(req, res, next) {
		res.render(this.view, { title: 'Auctions | AuctionIT!' });
	}
});

const { router, auth, exec } = AllController;

router.get('/', auth, exec);

module.exports = router;
