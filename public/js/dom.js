let dom = (function() {

	function find(selector) {
		return document.querySelectorAll(selector);
	}

	return { find };

})();	