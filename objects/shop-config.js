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
			res.json(body);
		}
		else {
			res.json(error);
		}
	});

};

