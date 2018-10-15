const 
	express = require('express'),
	router = express.Router();

router.use('/auth', require('./auth'));
router.use('/auctions', require('./auctions'));

module.exports = router;