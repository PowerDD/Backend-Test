$(function() {

	$(document).on('click', '.btn-logout', function(){
		$.post($('#apiUrl').val()+'/member/logut', { shop: $('#shop').val(), apiKey: $('#apiKey').val(), memberKey: $.cookie('memberKey'),
		}, function(data) {
			//window.location.reload();
		});
	});

});