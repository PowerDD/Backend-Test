$(function() {
	loadProduct();
});
function loadProduct(){
	$.post($('#apiUrl').val()+'/product/info', {
		apiKey: $('#apiKey').val(),
		shop: $('#shop').val(),
		type: 'categoryUrl',
		value: window.location.pathname.split('/')[2]
	}, function(data){
			if (data.success) {
				var product = data.result;
				var category = data.categoryId;
				var now = moment();				
				var addDate = moment("14/07/2015");
				console.log('diff:' + now.diff(addDate, 'days', true));	
				console.log('addDate' + addDate);
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadBrand(){
	try{
		$.post($('#apiUrl').val()+'/product/info', {
			apiKey: $('#apiKey').val(),
			shop: $('#shop').val(),
			type: 'categoryUrl',
			value: window.location.pathname.split('/')[2]
		}, function(data){
				if (data.success) {
					var brandArrey = [];
					for( i=0; i<data.result.length; i++ ) {
						var info = {};
						info['BrandId'] = data.result[i].BrandId;
						info['BrandName'] = data.result[i].Brand;
						brandArrey.push(info);						
					}					
					var unique = {};
					var distinct = [];
					for( var i in brandArrey ){
						if( typeof(unique[brandArrey[i].BrandName]) == 'undefined'){
							distinct.push(brandArrey[i]);
						}
							unique[brandArrey[i].Id] = 0;
							unique[brandArrey[i].BrandName] = 0;
					}
					console.log(distinct);
				}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
	}catch(err){
		console.log(err);
	}
};