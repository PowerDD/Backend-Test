$(function() {

	$('.numeric-only').ForceNumericOnly();

	$(document).on('click', '.btn-logout', function(){
		$.post($('#apiUrl').val()+'/member/logout', { shop: $('#shop').val(), apiKey: $('#apiKey').val(), memberKey: $.cookie('memberKey'),
		}, function(data) {
			$.removeCookie('memberKey');
			window.location.reload();
		});
	});

	$(document).on('click', 'a.option', function(){
		$(this).parents('.input-group').find('span.message').html( $(this).html()+'  ' );
		$(this).parents('.input-group').find('input.txt-input').attr('data-option', $(this).data('value') );
		$(this).parents('.input-group').find('ul.dropdown-menu li').removeClass('active');
		$(this).parents('li').addClass('active');
	});

});


jQuery.fn.ForceNumericOnly = function() {
	return this.each(function() {
		$(this).keydown(function(e) {
			if (/^[0-9]+$/.test($(this).val()) == false) {
				var text = $(this).val();
				$(this).val( text.substr(0, text.length-1) );
			}
			var key = e.charCode || e.keyCode || 0;
			return (
				(
					key == 13 || // Enter
					key == 8 || // Back Space
					(key >= 48 && key <= 57 && e.shiftKey== false) || // 0-9
					(key >= 96 && key <= 105) // 0-9 (Numpad)
				) && ( $(this).val().length == 0 || (/^[0-9]+$/.test($(this).val())) )
			);
		}),
		$(this).keyup(function(e) {
			if (/^[0-9]+$/.test($(this).val()) == false) {
				var text = $(this).val();
				$(this).val( text.substr(0, text.length-1) );
			}
		});
	});
};
