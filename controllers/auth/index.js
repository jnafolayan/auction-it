const 
	express = require('express'),
	router = express.Router();

router.use('/login', require('./login.controller'));
router.use('/signup', require('./signup.controller'));

module.exports = router;