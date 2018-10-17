const 
	express = require('express'),
	router = express.Router();

router.use('/auctions', require('./auctions'));
router.use('/auction', require('./auctions/auction.controller'));

module.exports = router;