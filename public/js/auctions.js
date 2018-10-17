(function() {

$(window).on('load', function(evt) {
	if (location.href.includes('auctions'))
	{
		fetch('/api/auctions')
			.then(function(res) {
				return res.json();
			})
			.then(function(res) {
				injectAuctions(res.auctions, res.user);
			});
	}
	else if (location.href.includes('auction/'))
	{
		let auctionID = location.href.match(/.*\/(.*)$/)[1];
		fetch('/api/auction/' + auctionID, { method: 'POST' })
			.then(function(res) {
				return res.json();
			})
			.then(function(res) {
				if (res.auction)
				{
					let by = res.user.fullname;
					initCountdown($('.auction.open').get(0), res.auction);

					if (!util.auction.isOpen(res.auction))
						$('#bidForm').hide();
					else
						$('#bidForm').show();

					$('#bidForm').on('submit', function(evt) {
						evt.preventDefault();
						let bid = +$("#bid").get(0).value;

						fetch('/api/auction/' + auctionID + '/bid?amount=' + bid + '&by=' + by, { method: 'POST' })
							.then(function(res) {
								return res.json();
							})
							.then(function(res) {
								$('#bids').get(0).innerHTML += '<p class="bid">$' + bid + ' from ' + by + '</p>';

								if (bid > Number($('#highestBid span').html()))
									$('#highestBid span').html(bid);
							});
					});
				}
			});
	}

	$('#auctionSearch').on('submit', function(evt) {
		evt.preventDefault();

		let id = $('#auctionID').get(0).value;
		fetch('/api/auction/' + id, { method: 'POST' })
			.then(function(res) {
				return res.json();
			})
			.then(function(res) {
				if (!res.auction)
					$('#allAuctions').html('<p class="p-t-20">No auctions matched your search.</p>');
				else
					injectAuctions([res.auction], res.user);
			});
	});
});

// keep track of auctions counting down so that they can stop counting down 
// when a new batch is to be injected.
let prevTrackedAucs = [];

function injectAuctions(auctions, user) {
	prevTrackedAucs.forEach(function(auc) {
		clearTimeout(auc.timeout);
	});

	prevTrackedAucs.length = 0;

	let username = user.username,
		fullname = user.fullname;

	// sort auctions according to state
	auctions.sort(function(a, b) { 
		return new Date(a.startTime).getTime() > new Date(b.startTime).getTime();
	});

	active = auctions.filter(function(auc) {
		return auc.bidders.includes(fullname) || auc.by === fullname;
	});

	function upper(str) {
		return str.toUpperCase();
	}

	let html = ['<ul id="auctionList" class="list">'];
	for (let auc of auctions) {
		let isOpen = util.auction.isOpen(auc);
		let item = [
			'<li class="auction' + (isOpen ? ' open' : '') + '" title="' + auc.id + '">',
				'<p class="auction-item">',
					upper(auc.item) + ' by ' + auc.by,
					'<span class="status" data-index="' + auctions.indexOf(auc) + '">',
					isOpen ? '' : 'CLOSED',
					'</span>',
				'</p>',
				'<p class="auction-desc">' + auc.itemDesc + '</p>',
				'<p class="auction-price">Going for: $' + auc.highestBid + '</p>',
			'</li>'
		];
		html = html.concat(item);
	}

	html.push('</ul>');
	if (auctions.length)
		$('#allAuctions').html(html.join('\n'));
	else
		$('#allAuctions').html('<p class="p-t-20">There are no auctions at the moment.</p>');

	$('li.auction.open').each(function(el) {
		let auc = auctions[+( $(el).find('.status').data('index') )];
		initCountdown(el, auc);
	});

	$('li.auction').on('click', function(evt) {
		window.location.href = '/auction/' + this.title;
	});
}

function initCountdown(el, auc) {
	let $el = $(el);
	let status = $el.find('.status');
	let endMS = new Date(auc.endDate || 0).getTime();
	let isSingle = $el.hasClass('auction-single');
	let now, time, secs, hrs, mins;

	prevTrackedAucs.push(auc);

	auc.timeout = setTimeout(function() {
		now = new Date().getTime();
		diff = endMS - now;
		time = Math.round(diff / 1000);
		secs = Math.max( 0, time % 60 ),
		mins = Math.floor(Math.max( 0, time / 60 )) % 60;
		hrs = Math.floor(Math.max( 0, time / 3600 ));

		let arr = [hrs + 'h ', mins + 'm ', secs + 's']
		if (isSingle)
			arr = [hrs + '<sup>o</sup><br><br>', mins + '\'\'<br><br>', secs + '\''];
		
		arr = arr.filter(function(t) {
			return t.charAt(0) !== '0';
		});

		if (diff <= 0) {
			status.html('CLOSED'.split('').join('<br>'));
			$el.removeClass('open');
		} else {
			if (isSingle)
				status.html('<span class="text-white">' + arr.join('') + "</span>");
			else
				status.html('Closing in <span class="text-green">' + arr.join('') + "</span>");

			auc.timeout = setTimeout(arguments.callee, 1000);
		}
	}, 1000);
}

})();