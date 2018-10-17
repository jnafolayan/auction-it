const 
	express = require('express'),
	router = express.Router();

router.use('/', require('./all.controller'));

module.exports = router;
