/* eslint-disable func-names */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const hbh = require('./config/handlebars-helpers.js');

const indexRouter = require('./routes/index');
const customersRouter = require('./routes/customers');
const captainsRouter = require('./routes/captains');
const ridesRouter = require('./routes/rides');
const register = require('./routes/register');

const app = express();

// view engine setup
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

module.exports = app;
