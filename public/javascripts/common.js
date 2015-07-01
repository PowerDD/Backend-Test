$(function() {

	$(document).on('click', '.btn-logout', function(){
		$.post($('#apiUrl').val()+'/member/login', { shop: $('#shop').val(), apiKey: $('#apiKey').val(),
			memberKey: $.cookie('memberKey'),
		}, function(data) {
			window.location.reload();
		});
	});

});