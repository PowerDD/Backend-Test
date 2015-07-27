$(function() {
	loadProductImage();
});
function loadProductImage(){
	$.post($('#apiUrl').val()+'/product/info', {
		apiKey: $('#apiKey').val(),
		shop: $('#shop').val(),
		type: 'item',
		value: '183'
	}, function(data){
			if (data.success) {
				var imgPath = data.result.CoverImage.split('/').slice(0,-1);
				//imgPath = imgPath.filter(function(n){ return n !== ''; });
				console.log(imgPath);							
			}
	}, 'json').fail( function(xhr, textStatus, errorThrown) { console.log(xhr.statusText); });
}

function loadProductAll(){
	$.post($('#apiUrl').val()+'/product/info', {
		apiKey: $('#apiKey').val(),
		shop: $('#shop').val(),
		type: 'all',
		value: 'all'
	}, function(data){
			if (data.success) {
				data.product = data.result;
				// Category And Brand //
				var categoryArrey = [];
				var brandArrey = [];
				for( i=0; i<data.result.length; i++ ) {
					var infoCat = {};
					var infoBrand = {};
					infoCat['CategotyId'] = data.result[i].CategoryId;
					infoCat['CategotyName'] = data.result[i].Category;
					infoCat['CategoryPriority'] = data.result[i].CategoryPriority;
					
					infoBrand['BrandId'] = data.result[i].BrandId;
					infoBrand['BrandName'] = data.result[i].Brand;
					infoBrand['BrandPriority'] = data.result[i].BrandPriority;
					categoryArrey.push(infoCat);		
					brandArrey.push(infoBrand);
				}	
				// Distinct Category //
				var uniqueCat = {};
				var distinctCat = [];
				for( var i in categoryArrey ){
					if( typeof(uniqueCat[categoryArrey[i].CategotyName]) == 'undefined'){
						distinctCat.push(categoryArrey[i]);
					}
					uniqueCat[categoryArrey[i].CategotyName] = 0;
				}
				// Distinct Brand //
				var uniqueBrand = {};
				var distinctBrand = [];
				for( var i in brandArrey ){
					if( typeof(uniqueBrand[brandArrey[i].BrandName]) == 'undefined'){
						distinctBrand.push(brandArrey[i]);
					}
					uniqueBrand[brandArrey[i].BrandName] = 0;
				}
				distinctCat.sort(orderJsonString('CategotyName'));
				distinctBrand.sort(orderJsonString('BrandPriority'));
				console.log(distinctCat);	
				console.log(distinctBrand);				
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

function orderJsonString(prop) {
   return function(a,b){
	  if( a[prop] > b[prop]){
		  return 1;
	  }else if( a[prop] < b[prop] ){
		  return -1;
	  }
	  return 0;
   }
};

function orderJsonInt(prop) {
   return function(a,b){
	  if( parseInt(a[prop]) > parseInt(b[prop])){
		  return 1;
	  }else if( parseInt(a[prop]) < parseInt(b[prop]) ){
		  return -1;
	  }
	  return 0;
   }
};