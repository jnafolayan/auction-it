module.exports = (func) => {

	return function() {
		let args = [].slice.apply(arguments);

		return new Promise((resolve, reject) => {
			args.push((err, data) => {
				if (err)
					reject(err);
				else
					resolve(data);
			});
			func.apply(null, args);
		});
	};

};
