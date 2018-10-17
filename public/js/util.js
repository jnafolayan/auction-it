const util = {};

util.auction = {
	/**
	 * Checks if an auction event is open.
	 * @param {Auction} auc 
	 * @return {boolean} open
	 */
	isOpen(auc) {
		let start, end, cur;

		start = new Date(auc.startDate || 0).getTime();
		end = new Date(auc.endDate || 0).getTime();
		cur = new Date().getTime();

		return cur >= start && cur < end; 
	},

	/**
	 * Computes how long an auction has been closed for.
	 * @param {Auction} auc 
	 * @return {number}
	 */
	getClosedPeriod(auc) {
		return new Date().getTime() - new Date(auc.endDate || 0).getTime();
	}
};