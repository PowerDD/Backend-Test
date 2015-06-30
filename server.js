var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , fs = require('fs')
  , path = require('path');

var app = express();
global.config = require('./config.js');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.configure('production', function () {
    app.use (function (req, res, next) {
      var schema = (req.headers['x-forwarded-proto'] || '').toLowerCase();
      if (schema === 'https') {
        next();
      } else {
        res.redirect('https://' + req.headers.host + req.url);
      }
    });
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});



app.get('*', function(req, res) {

	data = {};
	data.screen = (typeof req.cookies.memberKey == 'undefined' || req.cookies.memberKey =='') ? 'login' : 'index';
	data.systemName = process.env.systemName;
	data.title = process.env.systemName;
	data.titleDescription = '';
	data.apiKey = process.env.apiKey;

	if ( data.screen != 'login' ) {		
		var url = req.headers['x-original-url'].split('/');
		url = url.filter(function(n){ return n !== ''; });
		if ( url.length >= 1 ) {
			data.screen = url[0];
			fs.exists('./views/'+data.screen+'.jade', function (exists) {
				if (exists) {
					data.subUrl = (url.length == 1 ) ? '' : url[1];
					routes.index(req, res, data);
				}
				else {
					routes.index(req, res, data);
				}
			});
		}
		else {
			routes.index(req, res, data);
		}
	}
	else {
		routes.index(req, res, data);
	}

});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
