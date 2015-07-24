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
							unique[brandArrey[i].BrandName] = 0;
					}
					distinct.sort();
					distinct.reverse();
					console.log(distinct);
				}
		}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
	}catch(err){
		console.log(err);
	}
};