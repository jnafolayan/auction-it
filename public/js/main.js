$(window).on('load', function(evt) {

	$('.tab').on('click', function(evt) {
		let prev = $(this).parent().find('.active', true);
		let target = '#' + prev.data('target');
		prev.removeClass('active');
		$(target).removeClass('active');

		target = '#' + $(this).data('target');
		$(this).addClass('active');
		$(target).addClass('active');
	});	

	$('#createAuction').on('click', function(evt) {
		$('#createAuctionModal').show();
		let el = $('#createAuctionModal .modal-content');
		let start = -200,
			end = 10,
			k = 0;
		let i = setInterval(function() {
			k += 0.05;
			if (k > 1) {
				k = 1; 
				clearInterval(i);
			}
			el.css('top', (start + k * (end - start)) + 'px');
		}, 1000/60);


		let desc = $('#itemDesc'),
			charCount = $('#descCount');

		desc.on('input', function(evt) {
			charCount.html(150 - desc.get(0).value.length);
		});
	});

});