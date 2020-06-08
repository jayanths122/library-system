require('dotenv').config();

const express = require('express'),
      path = require('path'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;

// Set up mongoose and connect to Mongo  
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .catch((err) => console.error(err));

// Set up routes to handles requests 
const indexRouter = require('./routes/index'),
      userRouter = require('./routes/userRoutes'),
      bookRouter = require('./routes/bookRoutes'),
      adminRouter = require('./routes/adminRoutes');

const app = express();

// Define EJS as the view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body parse to parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'apiLauD',
    resave: false,
    saveUninitialized: false
}));

// Initialize pass and path to static files for the server to access
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Hook up the router middleware 
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/book', bookRouter);
app.use('/admin', adminRouter);

// passport configuration
const User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(process.env.PORT || 5000, () => {
    console.log(`Library server listening on PORT ${process.env.PORT || 5000}`);
});

module.exports = app;
