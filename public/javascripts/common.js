$(function() {

	$(document).on('click', '.btn-logout', function(){
		$.post($('#apiUrl').val()+'/member/logout', { shop: $('#shop').val(), apiKey: $('#apiKey').val(), memberKey: $.cookie('memberKey'),
		}, function(data) {
			$.removeCookie('memberKey');
			window.location.reload();
		});
	});

	$(document).on('click', 'a.option', function(){
		$(this).parents('.input-group').find('span.message').html( $(this).html() ).attr('data-value', $(this).data('value') );
	});

});