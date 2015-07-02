$(function() {

	$('.txt-input').each(function(){
		if ( $(this).attr('data-value') != undefined )
			$(this).val( $(this).attr('data-value') );
		$(this).parents('.input-group').find('span.message').html( $(this).parents('.input-group').find('ul.dropdown-menu li.active a').html() +'  ' );
	});

	$(document).on('click', '.btn-save', function(){
		var json = {};
		$(this).parents('.box').find('.box-body .txt-input').each(function(){
			if ( $(this).data('name') != undefined ) {
				json[$(this).data('name')] = {};
				if ( $(this).attr('data-value') != $(this).val() && $(this).val() != '' ) {
					json[$(this).data('name')].Value = $(this).val();
					if ( $(this).attr('data-option') != undefined )
						json[$(this).data('name')].Type = $(this).attr('data-option');
				}
				if ( $(this).attr('data-option') != undefined && $(this).attr('data-option-old') != $(this).attr('data-option') ) {
					json[$(this).data('name')].Value = $(this).val();
					json[$(this).data('name')].Type = $(this).attr('data-option');
				}
				if ( json[$(this).data('name')].Value == undefined && json[$(this).data('name')].Type == undefined )
					delete json[$(this).data('name')];
			}
		});
		var data =JSON.stringify(json);
		if ( data != '{}' ) {
			updateConfig(data);
		}
	});

});

function updateConfig( json ) {
	$.post($('#apiUrl').val()+'/shop-config/update', { shop: $('#shop').val(), apiKey: $('#apiKey').val(),
		value: json,
	}, function(data) {
		if (data.success) {
		}
		else {
		}
	});
}