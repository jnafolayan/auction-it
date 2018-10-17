(function() {

	function $(selector, context) {
		return new _$(selector, context);
	}

	function _$(selector, context) {
		if (!context) context = document;

		let list;
			
		if (selector === window || selector === document)
			list = [selector];
		else if (selector instanceof HTMLElement)
			list = [selector];
		else 
			list = context.querySelectorAll(selector);

		this.context = context;
		this.selector = selector;
		this._elements = [].slice.call(list);
	}

	_$.prototype = {
		_each: function(iterator, args) {
			this._elements.forEach(function(el, i, elements) {
				el && iterator.apply(el, [el].concat(args ? args : []).concat([i, elements]));
			});
			return this;
		},

		each: function(iterator) {
			this._elements.forEach(function(el, i, elements) {
				el && iterator(el,i,elements);
			});
			return this;
		},

		on: function(event, callback) {
			this._each(addEvent, [event, callback]);
			return this;
		},

		get: function(i) {
			return this._elements[i];
		},

		find: function(selector, directChildren) {
			let res = $(selector, this.get(0));
			let _this = this.get(0);

			if (directChildren)
				res._elements = res._elements.filter(function(el) { return el.parentElement === _this; });

			return res;
		},

		data: function(name) {
			return this.attr('data-' + name);
		},

		attr: function(name, value) {
			if (value != null)
				return this.get(0).setAttribute(name, value);
			return this.get(0)[name] || this.get(0).getAttribute(name);
		},

		addClass: function(name) {
			this._each(function(el) {
				el.classList.add(name);
			});
			return this;
		},

		removeClass: function(name) {
			this._each(function(el) {
				el.classList.remove(name);
			});
			return this;
		},

		hasClass: function(name) {
			return this.get(0).classList.contains(name);
		},

		css: function(key, value) {
			this._each(function(el) {
				el.style[key] = value;
			});
			return this;
		},

		show: function() {
			return this.css('display', 'block');
		},

		hide: function() {
			return this.css('display', 'none');
		},

		html: function(value) {
			if (value === undefined)
				return this.get(0).innerHTML;
			this._each(function(el) {
				el.innerHTML = value;
			});
			return this;
		},

		parent: function() {
			return $(this._elements[0].parentElement);
		},

		siblings: function() {
			let el = this._elements[0];
			let result = [];
			let open = [el];
			let node;

			while (open.length) {
				node = open.shift();
				if (node.nextElementSibling)
					open.push(node.nextElementSibling);
				if (node.previousElementSibling)
					open.push(node.previousElementSibling);
				if (node !== el)
					result.push(node);
			}

			return $(result);
		}
	};

	_$.prototype.constructor = _$;

	window.$ = $;

	let addEvent;
	if (window.addEventListener)
		addEvent = function(el, event, callback) {
			el.addEventListener(event, callback);
		};
	else if (window.attachEvent)
		addEvent = function(el, event, callback) {
			el.attachEvent(event, callback);
		};
	else {
		let cache = el['on' + event];

		if (cache === undefined)
			el['on' + event] = callback;
		else 
			el['on' + event] = function(evt) {
				cache.call(this, evt);
				callback.call(this, evt);
			};
	}

})();