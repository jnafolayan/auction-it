const BaseController = require('./base.controller');

const HomeController = BaseController.extend({
	view: 'home',

	getContent() {
		return { title: 'AuctionIt' };
	}
});

const { router, exec } = HomeController;

router.get('/', exec);

module.exports = router;
