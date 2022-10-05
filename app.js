const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
require('dotenv').config({ path: './config/.env' });

const app = express();

app.use(helmet.contentSecurityPolicy({
  directives: {
    "script-src": ["'self'", "cdn.jsdelivr.net"]
  }
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'views')));

// routers
const indexRouter = require('./routes/index');
const leaguesRouter = require('./routes/leagues');
const teamsRouter = require('./routes/teams');
const bookiesRouter = require('./routes/bookies');
const fixturesRouter = require('./routes/fixtures');
const oddsRouter = require('./routes/odds');
const apiRouter = require('./routes/api');

app.use('/', indexRouter);
app.use('/leagues', leaguesRouter);
app.use('/teams', teamsRouter);
app.use('/bookies', bookiesRouter);
app.use('/fixtures', fixturesRouter);
app.use('/odds', oddsRouter);
app.use('/api', apiRouter);

// scheduler
const scheduler = require('./data/scheduler');
scheduler.task1();
scheduler.task2();
scheduler.task3();


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
