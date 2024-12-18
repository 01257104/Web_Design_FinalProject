var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var serverRouter = require('./routes/server');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/server', serverRouter);

// 新增的路由來處理接收資料
app.get('/receive-data', (req, res) => {
  const userName = req.query.name;
  const score = req.query.score;

  // 呼叫 server.js 路由並傳遞資料
  // 假設 server.js 中有處理 /server/receive 這個路由
  fetch(`http://localhost:3000/server/receive?name=${userName}&score=${score}`)
    .then(response => response.text())
    .then(data => {
      console.log('Server 回傳:', data);
      res.send('資料已送到 server.js');
    })
    .catch(err => {
      console.error('錯誤:', err);
      res.status(500).send('發生錯誤');
    });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});




// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
