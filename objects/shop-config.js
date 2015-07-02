var request = require('request');

exports.action = function(req, res, data) {
	request.post({headers: { 'referer': 'https://' + req.get('host') }, url: data.apiUrl + '/shop-config/info',
		form: {
			apiKey: data.apiKey,
			shop: data.shop,
		}
	},
	function (error, response, body) {
		if (!error) {
			var json = JSON.parse( body );
			if ( json.success ) {
				data.config = json.config;
				res.render(data.screen, { data: data });
			}
			else {
				res.json(body);
			}
		}
		else {
			res.json(error);
		}
	});

};

