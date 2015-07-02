$(function() {

	$(document).on('click', '.btn-logout', function(){
		$.post($('#apiUrl').val()+'/member/logout', { shop: $('#shop').val(), apiKey: $('#apiKey').val(), memberKey: $.cookie('memberKey'),
		}, function(data) {
			$.removeCookie('memberKey');
			window.location.reload();
		});
	});

	$(document).on('click', 'a.option', function(){
		console.log( $(this).data('value') );
	});

});