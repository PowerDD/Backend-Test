$(function() {
	getShopConfig();
});
function loadProductAll(){
	$.post($('#apiUrl').val()+'/product/info', {
		apiKey: $('#apiKey').val(),
		shop: $('#shop').val(),
		type: 'all',
		value: 'all'
	}, function(data){
			if (data.success) {
				data.product = data.result;
				
				var unique = {};
				var distinct = [];
				for( var i in data.result ){
					if( typeof(unique[data.result[i].CategotyId]) == 'undefined'){
						distinct.push(data.result[i].CategotyId);
						distinct.push(data.result[i].Categoty);
					}
					unique[data.result[i].CategotyId] = 0;
				}
				distinct.sort();
				distinct.reverse();
				
				console.log(distinct);				
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function getShopConfig(){
	$.post($('#apiUrl').val()+'/shop-config/info', {
		apiKey: $('#apiKey').val(),
		shop: $('#shop').val()
	}, function(data){
			if (data.success) {
				console.log(data.config.NewProductExpire);
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

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
				var now = moment().startOf('day');				
				var addDate = moment(data.result[101].AddDate).add(3600*7, 'seconds').startOf('day');
				console.log('diff:' + now.diff(addDate, 'days', true));	
				console.log('addDate: ' + addDate);
				console.log('now: ' + now);
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