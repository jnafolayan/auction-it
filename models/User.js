const 
	db = require('../db'),
	bcrypt = require('bcrypt-nodejs');

let userSchema = {
	username: String,
	fullname: String,
	phone: String,
	email: String,
	password: String
};

class User {
	constructor(opts, notNew) {
		for (let key in userSchema) {
			this[key] = userSchema[key](opts[key]);
		}

		if (!notNew)
			this.generateHash(this.password);
	}

	save() {
		return db.create('users', this.getProperties());
	}

	getProperties() {
		let props = {};
		for (let key in userSchema)
			if (userSchema.hasOwnProperty(key))
				props[key] = this[key];
		return props;
	}

	generateHash(password) {
		this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	}

	passwordEqual(password) {
		return bcrypt.compareSync(password, this.password);
	}

	static exists(name) {
		return db
			.findOne('users', { username: name })
			.then(user => user ? true : false)
			.catch(err => false);
	}

	static find(query) {
		return db
			.find('users', query)
			.then(users => users.map(u => new User(u, true)));
	}

	static findOne(query) {
		return db
			.findOne('users', query)
			.then(user => user ? new User(user, true) : null);
	}
}

module.exports = User;
