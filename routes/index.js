var request = require('request');
var moment = require('moment');

exports.index = function(req, res, data) {
	
	request.post({headers: { 'referer': 'https://' + req.get('host') }, url: data.apiUrl + '/member/exist/memberKey',
		form: {
			apiKey: data.apiKey,
			shop: data.shop,
			memberKey: req.cookies.memberKey,
		}
	},
	function (error, response, body) {
		if (!error) {
			res.send(body);
			//var json = JSON.parse(body);
			//data.screen = ( json.success && json.exist ) ? data.screen : 'login';
		}
		else {
			res.send(error);
			//data.screen = 'login';
		}

		/*if (data.screen == 'login') {
			data.title = 'เข้าสู่ระบบ - ' + data.title;
			res.render(data.screen, { data: data });
		}
		else {
			exports.getMemberInfo(req, res, data)
		}*/

	});

};

exports.getMemberInfo = function(req, res, data) {
	request.post({headers: { 'referer': 'https://' + req.get('host') }, url: data.apiUrl + '/member/info',
		form: {
			apiKey: data.apiKey,
			shop: data.shop,
			memberKey: req.cookies.memberKey,
		}
	},
	function (error, response, body) {
		if (!error) {
			var json = JSON.parse(body);
			data.memberInfo = json.memberInfo
			if ( typeof data.memberInfo.Firstname != 'undefined' && data.memberInfo.Firstname != null && data.memberInfo.Firstname != '' ) {
				data.memberInfo.DisplayName = data.memberInfo.Firstname;
			}
			else if ( typeof data.memberInfo.Nickname != 'undefined' && data.memberInfo.Nickname != null && data.memberInfo.Nickname != '' ) {
				data.memberInfo.DisplayName = data.memberInfo.Nickname;
			}
			else if ( typeof data.memberInfo.Username != 'undefined' && data.memberInfo.Username != null && data.memberInfo.Username != '' ) {
				data.memberInfo.DisplayName = data.memberInfo.Username;
			}
			else {
				data.memberInfo.DisplayName = 'Guest';
			}

			var local = data.memberInfo.Locale.substr(0,2);
			if (local != 'th' || local != 'en') local != 'th';
			req.setLocale(data.memberInfo.Locale.substr(0,2));
			moment.locale(data.memberInfo.Locale.replace('_', '-'));
			data.memberInfo.RegisterDate = moment(data.memberInfo.RegisterDate)
				.zone((data.memberInfo.Timezone > 0 ? '+' : '-')+'0'+data.memberInfo.Timezone+':00')
				.fromNow();
		}

		if (data.screen == 'index') {
			data.title = 'ภาพรวมระบบ - ' + data.title;
		}

		res.render(data.screen, { data: data });

	});

}