var request = require('request');
var moment = require('moment');
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
				res.json(data);
				//res.render(data.screen, { data: data});
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