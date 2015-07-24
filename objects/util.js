var request = require('request');
var moment = require('moment');
exports.getCategoryMenu = function(req, res, data) {
//## Get Category Menu ##//	
	try{
		request.post({headers: { 'referer': 'https://' + req.get('host') }, url: data.apiUrl + '/category/info',
			form: {
				apiKey: data.apiKey,
				shop: data.shop
			}
		},
		function (error, response, body) {
			if (!error) {				
				var json = JSON.parse(body);
				//data.category = json.result;
				json.result.exports.orderJsonInt('ID');
				data.category = json.result;
				var routesIndex = require('../routes/index');
				routesIndex.afterGetCategoryMenu( req, res, data );
			} else{
				data.error = error.message;
				data.stack = error.stack;
				res.render('error', { data: data });
			}
		});
	}
	catch(error) {
		data.error = error.message;
		data.stack = error.stack;
		res.render('error', { data: data });
	}
};

exports.sortResults = function(arr, prop, asc, type) {
	if(type == 'string'){
		 return arr = arr.sort(function(a, b) {
			if (asc == 'asc') return (a[prop] > b[prop]);
			else return (b[prop] > a[prop]);
		});
	}
	else{
		return arr = arr.sort(function(a, b) {
			if (asc == 'asc') return 1;
			else if (asc == 'asc') return -1;
			else return 0;
		});
	}
	//return arr = arr.sort();
}

exports.orderJsonString = function(prop) {
   return function(a,b){
	  if( a[prop] > b[prop]){
		  return 1;
	  }else if( a[prop] < b[prop] ){
		  return -1;
	  }
	  return 0;
   }
};

exports.orderJsonInt = function(prop) {
   return function(a,b){
	  if( parseInt(a[prop]) > parseInt(b[prop])){
		  return 1;
	  }else if( parseInt(a[prop]) < parseInt(b[prop]) ){
		  return -1;
	  }
	  return 0;
   }
};

//--------// Render Screen //--------//
exports.renderProductCategory = function(req, res, data){
	//## Render Product in Category ##//
	try{
		request.post({headers: { 'referer': 'https://' + req.get('host') }, url: data.apiUrl + '/product/info',
			form: {
				apiKey: data.apiKey,
				shop: data.shop,
				type: 'categoryUrl',
				value: data.subUrl
			}
		},
		function (error, response, body) {
			if (!error) {
				var json = JSON.parse(body);
				data.product = json.result;
				data.categoryName = json.categoryName;
				
				//## [Start] Summary Brand in Category ##//
				var brandArrey = [];					
				for ( i=0; i< json.result.length; i++){
					var info = {};
					info['BrandName'] = json.result[i].Brand;
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
				
				data.brandInCategory = distinct;
				//## [End] Summary Brand in Category ##//
				
				data.title = data.categoryName + ' - ' + data.title;
				data.titleDescription = data.categoryName;
				res.render(data.screen, { data: data});
			} else{
				data.error = error.message;
				data.stack = error.stack;
				res.render('error', { data: data });
			}
		});
	}
	catch(error) {
		data.error = error.message;
		data.stack = error.stack;
		res.render('error', { data: data });
	}
};
//--------\\ Render Screen \\--------//