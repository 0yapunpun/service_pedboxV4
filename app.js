var createError = require('http-errors');
var express = require('express');
var path = require('path');
var router = require('./routes/router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Midleware para  configurar el server para permitir cross domain
var allowCrossDomain = function (req, res, next) {
  //Método que configura  la solicitudes de dominios diferente al server
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-generaled-With, Origin, Accept, x-xsrf-token, X-XSRF-TOKEN, Cache-Control, Pragma');
  //res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-generaled-With,Accept, Accept-Encoding, Accept-Language, Cache-Control, Connection, Host, If-Modified-Since, If-None-Match, Origin, Referer, User-Agent')
  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
      res.send(200);
  } else {
      next();
  }
};

//middlewares
app.use((req, res, next) => {
  next();
});
app.use(allowCrossDomain);//Habilitar en la aplicacion Cross Domain

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({"success": false});
});

module.exports = app;

