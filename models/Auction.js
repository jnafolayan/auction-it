const 
	db = require('../db'),
	bcrypt = require('bcrypt-nodejs'),
	CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Database schema
 */
let auctionSchema = {
	id: String,
	item: String,
	itemDesc: String,
	itemPrice: Number,
	highestBid: Number,
	bidders: Array,
	by: String,
	startDate: String,
	endDate: String,
	winner: String
};

/**
 * Model for Auctions
 * @param {object} opts - config object
 */
class Auction {
	constructor(opts, isOld) {
		this.id = null;


		for (let key in auctionSchema) {
			if (isOld) 
				this[key] = opts[key];
			else
				if (key in opts)
					this[key] = auctionSchema[key](opts[key]);
				else
					this[key] = auctionSchema[key]();
		}
	}

	save() {
		return db.create('auctions', this.getProperties());
	}

	async generateID(len=8) {
		// shuffle character set
		let charset = CHARSET.split('');
		let count = charset.length * 2;
		while (count--) {
			let a = Math.floor(Math.random() * charset.length);
			let b = Math.floor(Math.random() * charset.length);
			let tmp = charset[a];
			charset[a] = charset[b];
			charset[b] = tmp;
		}

		let i, id;

		async function gen() {
			i = len;
			id = '';
			while (i--) {
				id += charset[Math.floor(Math.random() * charset.length)];
			}
			let exists = await Auction.exists(id);
			if (exists)
				return gen();
			return id;
		}

		id = await gen();
		return id;
	}

	getProperties() {
		let props = {};
		for (let key in auctionSchema)
			if (auctionSchema.hasOwnProperty(key))
				props[key] = this[key];
		return props;
	}

	static exists(id) {
		return db
			.findOne('auctions', { id: id })
			.then(auction => auction ? true : false)
			.catch(err => false);
	}

	static find(query) {
		return db
			.find('auctions', query)
			.then(auctions => auctions.map(a => new Auction(a, true)));
	}

	static findOne(query) {
		return db
			.findOne('auctions', query)
			.then(auction => auction ? new Auction(auction, true) : null);
	}

	static updateOne(query, update) {
		return db
			.updateOne('auctions', query, update);
	}

	/**
	 * Checks if an auction event is open.
	 * @param {Auction} auc 
	 * @return {boolean} open
	 */
	static isOpen(auc) {
		let start, end, cur;

		start = new Date(auc.startDate).getTime();
		end = new Date(auc.endDate).getTime();
		cur = new Date().getTime();

		return cur >= start && cur < end; 
	}

	/**
	 * Computes how long an auction has been closed for.
	 * @param {Auction} auc 
	 * @return {number}
	 */
	static getClosedPeriod(auc) {
		return new Date().getTime() - new Date(auc.endDate).getTime();
	}
}

module.exports = Auction;
