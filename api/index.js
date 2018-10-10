const express = require('express');

module.exports = app => {

	let router = express.Router();

	app.use('/api', router);

	require('./auctions.js', router);

};
