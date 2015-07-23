$(function() {
	loadBrand();
});

function loadBrand(){
	try{
		$.post($('#apiUrl').val()+'/product/info', {
			apiKey: $('#apiKey').val(),
			shop: $('#shop').val(),
			type: 'categoryUrl',
			value: window.location.pathname.split('/')[2]
		}, function(data){
				if (data.success) {
					if (data.correct) {
						for( i=0; i<data.result.length; i++ ) {
							var result = data.result[i];
							
						}					
					}
				}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
	}catch(err){
		console.log(err);
	}
};