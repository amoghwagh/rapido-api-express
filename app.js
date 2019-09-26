/* eslint-disable func-names */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const createError = require('http-errors');
const hbh = require('./utils/handlebars-helpers.js');

const indexRouter = require('./routes/index');
const customersRouter = require('./routes/customers');
const captainsRouter = require('./routes/captains');
const ridesRouter = require('./routes/rides');
const register = require('./routes/register');

const app = express();

app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    helpers: hbh,
    layoutsDir: 'views/layouts/'
  })
);
app.set('view engine', '.hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/customers', customersRouter);
app.use('/captains', captainsRouter);
app.use('/rides', ridesRouter);
app.use('/register', register);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.error = err;
  // res.locals.message = err.message;

  // res.status(err.status || 500);

  // Create error object
  const errorSend = {
    status: err.status,
    message: err.message
  };
  res.json(errorSend);
  // res.render('error');
});

module.exports = app;
