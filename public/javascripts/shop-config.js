$(function() {

	$('.txt-input').each(function(){
		if ( $(this).attr('data-value') != undefined )
			$(this).val( $(this).attr('data-value') );
	});

});