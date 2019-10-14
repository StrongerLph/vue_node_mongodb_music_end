var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressJWT = require('express-jwt');

const config = require('./config/config');

const usersRouter = require('./routes/users');
const songsRouter = require('./routes/songs')
const upLoadRouter = require('./routes/upload')

var app = express();

mongoose.connect(config.dbUrl, {useNewUrlParser: true}, err => {
  if(!err) {
    console.log('数据库连接成！')
  } else {
    console.log('数据库连接失败！')
    throw err
  }
})

app.use(function (req, res, next) {
  //设置可访问的域名 req.headers.orgin为nodejs下获取访问的域名地址
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  //设置可访问方法名
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  //设置可访问的头
  res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
  //设置cookie时长
  res.header("Access-Control-Max-Age", "1728000");
  //允许凭证,解决session跨域丢失问题
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

//用body parser 来解析post和url信息中的参数
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '1024kb' }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 全局token拦截检验
app.use(expressJWT({secret: config.secret}).unless({path: ['/users/sign-in', '/users/login']}))

// 请求路由
app.use('/users', usersRouter);
app.use('/songs', songsRouter);
app.use('/upload', upLoadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if (err) {
    if (err.message === 'No authorization token was found') {
      res.json({code: 403, success: false, msg: err.message})
    }
    res.json({code: 500, success: false, msg: err.message})
  } else {
    next()
  }
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
