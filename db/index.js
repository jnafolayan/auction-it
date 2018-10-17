const fs = require('fs');
const promisify = require('./promisify');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
let records;

const db = {};
module.exports = db;

db.retrieve = () => {
	return readFile(__dirname + '/log.json', 'utf-8')
		.then(data => {
			records = JSON.parse(data);
		});
};

db.write = () => {
	return writeFile(__dirname + '/log.json', JSON.stringify(records));
};

db.create = (table, obj) => {
	if (!records[table])
		records[table] = [];
	records[table].push(obj);
	return db.write().then(() => true);
};

db.updateOne = promisify((table, query, update, cb) => {
	return db.findOne(table, query)
		.then((rec) => {
			if (rec) 
			{
				for (let type in update)
				{
					let props = update[type];
					if (type === '__concat')
					{
						for (let key in props) 
						{
							if ((key in rec) && Array.isArray(props[key]))
							{
								rec[key] = rec[key].concat(props[key]);
							}
						}
					}
					else
					{
						for (let key in props) 
						{
							if (key in rec)
							{
								rec[key] = props[key];
							}
						}
					}
				}
				return db.write().then(() => cb(null, true));		
			}

			return cb(null, false);
		})
		.catch(() => cb(null, false));
});

db.findOne = promisify((table, query, cb) => {
	records[table] = records[table] || [];
	
	for (let rec of records[table]) {
		for (let k in query) {
			if (rec[k] === query[k]) {
				return cb(null, rec);
			}
		}
	}
	
	return cb(null, null);
});

db.find = promisify((table, query, cb) => {
	let requiredCount = Object.keys(query).length;
	let valid = [];

	records[table] = records[table] || [];

	for (let rec of records[table]) {
		let count = 0;
		for (let k in query) {
			if (rec[k] === query[k]) {
				count++;
			}
		}
		if (count === requiredCount)
			valid.push(rec);
	}

	return cb(null, valid);
});

db.connect = () => {
	db.retrieve();
	// Keep updating the db
	setInterval(() => db.retrieve(), 5000);
};
