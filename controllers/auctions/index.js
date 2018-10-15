const 
	express = require('express'),
	router = express.Router();

router.use('/', require('./all.controller'));
router.use('/create', require('./create.controller'));

module.exports = router;
