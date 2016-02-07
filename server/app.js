(function () {
    'use strict';

    var express = require('express');
    var path = require('path');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var cookieSession = require('cookie-session');
    var dotenv = require('dotenv');
    var mongoose = require('mongoose');
    var session = require('express-session');
    var passport = require('passport');
    var MongoStore = require('connect-mongo/es5')(session);
    var flash = require('express-flash');
    var crypto = require('crypto');
    var expressValidator = require('express-validator');
    var favicon = require('serve-favicon');

    var SegfaultHandler = require('segfault-handler');
    SegfaultHandler.registerHandler('crash.log');

    dotenv.load({ path: 'server/config/dev.env' });

    var passportConf = require('./config/passport');

    var app = express();

        
    // Connect to MongoDB.
    mongoose.connect(process.env.MONGODB || process.env.MODULUS_URI);
    mongoose.connection.on('error', function () {
        console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
        process.exit(1);
    });

    app.set('trust proxy', 1); // trust first proxy
        
    // Configure reddit snoocore
    // var reddit = require('./config/snoocore/index');
    // var redditRoutes = require('./routes/reddit/index')(reddit, app);
    
    // Configure medium client
    // var mediumConfig = require('./config/medium/index');
    // var mediumRoutes = require('./routes/medium/index')(mediumConfig.medium, mediumConfig.client, app);
        
    // Configure twitter client
    // var twitterClient = require('./config/twitter/index');
    // var twitterRoutes = require('./routes/twitter/index')(twitterClient, app);
    
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');

    app.use(favicon(path.join(__dirname, '..', 'client', 'favicon.ico')));

    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(expressValidator());
    app.use(flash());
        
    // Setup session
    app.use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
    }));

    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
        store: new MongoStore({
            url: process.env.MONGODB || process.env.MODULUS_URI,
            autoReconnect: true
        })
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function (req, res, next) {
        res.locals.user = req.user;
        next();
    });

    app.use(function (req, res, next) {
        if (/api/i.test(req.path)) {
            req.session.returnTo = req.path;
        }
        next();
    });

    app.use(express.static(path.join(__dirname, '../')));
    switch (process.env.NODE_ENV) {
        case 'production':
            app.use(express.static(path.join(__dirname, '../build')));
            break;
        default:
            app.use(express.static(path.join(__dirname, '../client')));
            break;
    }

    app.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "X-Requested-With,X-Powered-By,Content-Type");
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    });

    var routes = require('./routes/index');
    app.use('/', routes);
        
    // API routes
    // app.use('/api/reddit', redditRoutes);
    // app.use('/api/medium', mediumRoutes);
    // app.use('/api/twitter', twitterRoutes);

    // OAuth logins/callbacks =============================================================================================
    app.get('/login/twitter', passport.authenticate('twitter'));

    app.get('/login/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login/twiiter/failed' }), function (req, res) {
        console.log('\n\n Twitter Auth Complete');
        res.redirect('/#/twitter');
    });

    app.get('/login/reddit', function (req, res, next) {
        req.session.state = crypto.randomBytes(32).toString('hex');
        passport.authenticate('reddit', {
            state: req.session.state,
            duration: 'permanent',
            scope: ['identity', 'read', 'history']
        })(req, res, next);
    });

    app.get('/login/reddit/callback', function (req, res, next) {
        // Check for origin via state token
        if (req.query.state == req.session.state) {
            passport.authenticate('reddit', {
                successRedirect: '/#/reddit',
                failureRedirect: '/login'
            })(req, res, next);
        }
        else {
            next(new Error(403));
        }
    });

    app.get('/login/imgur', passport.authenticate('imgur'));

    app.get('/login/imgur/callback', passport.authenticate('imgur', { failureRedirect: '/login/imgur/failed' }), function (req, res) {
        res.redirect('/#/imgur');
    });

    app.get('/login/tumblr', passport.authenticate('tumblr'));

    app.get('/login/tumblr/callback', passport.authenticate('tumblr', { failureRedirect: '/login/tumblr/failed' }), function (req, res) {
        res.redirect('/#/tumblr');
    });

    // API Controllers =============================================================================================
    var twitterController = require('./controllers/twitter');
    app.get('/api/twitter/favorites', passportConf.isAuthenticated, passportConf.isAuthorized, twitterController.getFavorites);

    var redditController = require('./controllers/reddit');
    app.get('/api/reddit/me', passportConf.isAuthenticated, passportConf.isAuthorized, redditController.getCurrentUser);
    app.get('/api/reddit/saved', passportConf.isAuthenticated, passportConf.isAuthorized, redditController.getSavedPosts);

    var imgurController = require('./controllers/imgur');
    app.get('/api/imgur/favorites', passportConf.isAuthenticated, passportConf.isAuthorized, imgurController.getFavorites);
    app.get('/api/imgur/account', passportConf.isAuthenticated, passportConf.isAuthorized, imgurController.getAccount);
    app.get('/api/imgur/refresh', passportConf.isAuthenticated, passportConf.isAuthorized, imgurController.refresh);

    var tumblrController = require('./controllers/tumblr');
    app.get('/api/tumblr/likes', passportConf.isAuthenticated, passportConf.isAuthorized, tumblrController.getUsersLikes);

    var userController = require('./controllers/user');
    app.get('/api/user/all', userController.all);
    // app.post('/api/user/delete', userController.delete);
    app.post('/api/user/forgotpassword', userController.postForgot);
    app.post('/api/user/create', userController.createUser);
    app.post('/api/user/account/unlink', passportConf.isAuthenticated, userController.unlinkAccount);
    app.post('/api/user/update', passportConf.isAuthenticated, userController.updateProfile);
    app.post('/api/user/password', passportConf.isAuthenticated, userController.setPassword);
    app.post('/api/user/password/reset', userController.resetPassword);
    app.post('/api/user/login', userController.postLogin);
    app.post('/api/user/validateResetToken', userController.validateResetToken);

    app.get('/api/user', function (req, res) {
        return res.send(req.user);
    });

    app.get('/api/logout', function (req, res) {
        req.logout();
        return res.send(true);
    });

    app.set('port', process.env.PORT || 3000);

    var server = app.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + server.address().port);
    });

    module.exports = app;
} ());
