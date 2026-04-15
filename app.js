var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var kipkRouter = require('./routes/kip-k');
var productRouter = require('./routes/product');
var kategoriRouter = require('./routes/kategori');
var mahasiswaRouter = require('./routes/mahasiswa');

// add session + flash support for storing messages
const session = require('express-session');
const MemoryStore = require('session-memory-store')(session);
const flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/static", express.static(path.join(__dirname, 'public/images')));

// express-session must be initialized before flash
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store: new MemoryStore()
}));
app.use(flash());

// make flash messages available in all views via res.locals
app.use(function(req, res, next) {
  res.locals.messages = req.flash();
  next();
});

// make user session available in all views via res.locals
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

// middleware auth
function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Silakan login terlebih dahulu.');
    return res.redirect('/login');
  }
  next();
}

app.use('/', indexRouter);
app.use('/users', requireAuth, usersRouter);
app.use('/about', aboutRouter);
app.use('/kip-k', kipkRouter);
app.use('/product', requireAuth, productRouter);
app.use('/kategori', requireAuth, kategoriRouter);
app.use('/mahasiswa', requireAuth, mahasiswaRouter);

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
  res.render('error');
});

module.exports = app;
