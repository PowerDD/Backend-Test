var request = require('request');

exports.index = function(req, res, data){
	
	request.post({headers: { 'referer': 'https://' + req.get('host') }, url: data.apiUrl + '/member/exist/memberKey',
		form: {
			apiKey: data.apiKey,
			shop: data.shop,
			memberKey: req.cookies.memberKey,
		}
	},
	function (error, response, body) {
		if (!error) {				
			var json = JSON.parse(body);
			data.screen = ( json.success && json.exist ) ? data.screen : 'login';
		}
		else {
			data.screen = 'login';
		}

		if (data.screen == 'login') {
			data.title = 'เข้าสู่ระบบ - ' + data.title;
		}
		res.render(data.screen, { data: data });

	});

	/*if (data.screen == 'member') {
		data.title = 'Member - ' + data.title;
		data.titleDescription += 'ข้อมูลสมาชิกทั่วไป';
	}
	else if (data.screen == 'order') {
		data.title = 'Order - ' + data.title;
		data.titleDescription += 'คำสั่งซื้อ';
	}
	else if (data.screen == 'console') {
		data.title = 'Developer Console - ' + data.title;
		data.titleDescription += ' ';
	}

	res.render(data.screen, { data: data });*/

};