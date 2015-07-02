$(function() {

	$('.txt-input').each(function(){
		if ( $(this).attr('data-value') != undefined )
			$(this).val( $(this).attr('data-value') );
		$(this).parents('.input-group').find('span.message').html( $(this).parents('.input-group').find('ul.dropdown-menu li.active a').html() +'  ' );
	});

});