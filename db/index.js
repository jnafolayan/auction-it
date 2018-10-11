const fs = require('fs');
const promisify = require('./promisify');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
let records;

const db = {};

db.retrieve = () => {
	return readFile('log.json', 'utf-8')
		.then(data => {
			records = JSON.parse(data).records;
		});
};

db.write = () => {
	return writeFile('log.json', JSON.stringify({ records }));
};

db.create = promisify((obj, cb) => {
	records.push(obj);
	db.write()
		.then(() => cb(null, true));
});

db.update = (query, obj, cb) => {
	return db.find(query)
		.then((rec) => {
			for (let k in obj) {
				rec[k] = obj[k];
			}
			return rec;
		});
};

db.find = promisify((query, cb) => {
	for (let rec of records) {
		for (let k in query) {
			if (rec[k] === query[k]) {
				return cb(null, rec);
			}
		}
	}
	return cb(new Error("Couldn't find :("));
});

db.retrieve()
	.then(() => console.log(records));

module.exports = db;