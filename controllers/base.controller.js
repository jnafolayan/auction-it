const express = require('express');

const BaseController = {
	view: '',
	content: null,
	router: null,

	extend(config) {
		let ctrl = Object.create(this);

		ctrl.view = '';
		ctrl.content = null;
		ctrl.router = express.Router();

		for (let key in config) {
			ctrl[key] = config[key];
		}

		// Enforce scope
		ctrl.exec = ctrl.exec.bind(ctrl);
		
		return ctrl;
	},

	auth(req, res, next) {
		if (req.isAuth()) 
			next();
		else 
			res.redirect(303, '/');
	},

	notAuth(req, res, next) {
		if (!req.isAuth()) 
			next();
		else 
			res.redirect(303, '/auctions');
	},

	jsonAuth(req, res, next) {
		if (req.isAuth())
			next();
		else 
			res.json({ error: 500, message: 'Forbidden' });
	},

	getContent(req, res) {
		return {};
	},

	/**
	 * Executes main logic. It is unique to some controllers.
	 * @param {request} req - the request object
	 * @param {response} res - the response object
	 * @param {next} next - pass control to the next middleware
	 */
	exec(req, res, next) {
		// placeholder function
		res.render(this.view, this.getContent(req, res));
	}
};

module.exports = BaseController;