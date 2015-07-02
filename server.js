var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
  , i18n = require('i18n');

i18n.configure({
	locales: ['th', 'en'],
	defaultLocale: 'th',
	directory: __dirname + '/locales'
});

var app = express();


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(i18n.init);
  app.use(express.cookieParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.all('*', function(req, res, next) {
	if (!req.get('x-arr-ssl'))
		res.redirect('https://' + req.get('host') + req.url);
	else
		next();
});

app.get('*', function(req, res) {

	data = {};
	data.screen = (typeof req.cookies.memberKey == 'undefined' || req.cookies.memberKey =='') ? 'login' : 'index';
	data.systemName = process.env.systemName;
	data.title = process.env.systemName;
	data.titleDescription = '';
	data.shop = process.env.shop;
	data.apiKey = process.env.apiKey;
	data.apiUrl = process.env.apiUrl;

	if ( data.screen != 'login' ) {		
		var url = req.headers['x-original-url'].split('/');
		url = url.filter(function(n){ return n !== ''; });
		if ( url.length >= 1 ) {
			data.screen = url[0];
			fs.exists('./views/'+data.screen+'.jade', function (exists) {
				if (exists) {
					fs.exists('./public/javascripts/'+data.screen+'.js', function (exists) {
						data.script = (exists) ? '/javascripts/'+data.screen+'.js' : '';	
						data.subUrl = (url.length == 1 ) ? '' : url[1];
					});
				}
			});
		}
	}

	routes.index(req, res, data);

});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
