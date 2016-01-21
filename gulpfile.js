(function () {
    'use strict';

    var gulp = require('gulp'),
        nodemon = require('gulp-nodemon'),
        watch = require('gulp-watch'),
        jshint = require('gulp-jshint'),
        livereload = require('gulp-livereload'),
        ts = require('gulp-typescript'),
        inject = require('gulp-inject'),
        // count = require('gulp-count'),
        sass = require('gulp-sass'),
        bowerFiles = require('main-bower-files'),
        templateCache = require('gulp-angular-templatecache'),
        concat = require('gulp-concat'),
        concatCss = require('gulp-concat-css'),
        cssNano = require('gulp-cssnano'),
        del = require('del'),
        rename = require('gulp-rename'),
        uglify = require('gulp-uglify'),
        util = require('gulp-util'),
        merge = require('merge-stream'),
        // useref = require('gulp-useref'),
        exists = require('path-exists').sync,
        path = require('path'),
        filter = require('gulp-filter'),
        _paths = ['server/**/*.js', 'client/js/**/*.js'];

    var config = require('./gulp.config')();
    var wiredep = require('wiredep').stream;
    var wiredepOptions = config.getWiredepDefaultOptions();
    
    //register nodemon task
    gulp.task('nodemon', function () {
        return nodemon({
            script: 'server/app.js',
            env: {
                'NODE_ENV': 'production'
            }
        })
            .on('restart');
    });
  
    //register nodemon task
    gulp.task('nodemon:debug', function () {
        return nodemon({
            script: 'server/app.js',
            env: {
                'NODE_ENV': 'development'
            },
            nodeArgs: ['--debug']
        })
            .on('restart');
    });

    // Rerun the task when a file changes
    gulp.task('watch', function () {
        livereload.listen();
        gulp.src(_paths, {
            read: false
        })
            .pipe(watch())
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
        watch(_paths, livereload.changed);
    });

    //lint js files
    // gulp.task('lint', function () {
    //     gulp.src(_paths)
    //         .pipe(jshint())
    //         .pipe(jshint.reporter('default'));
    // });

    gulp.task('fonts', function () {
        // dev
        var dev = gulp.src(config.fonts)
            .pipe(gulp.dest(config.fontsDir));
        // build
        var build = gulp.src(config.fonts)
            .pipe(gulp.dest(config.buildFontsDir));

        return merge(dev, build);
    });

    gulp.task('templateCache', function () {
        return gulp.src(config.htmltemplates)
            .pipe(templateCache())
            .pipe(gulp.dest(config.build));
    });

    gulp.task('compile:scss', function () {
        return gulp.src([config.scss, config.bower.directory + '/font-awesome/scss/font-awesome.scss'])
            .pipe(sass().on('on', sass.logError))
            .pipe(gulp.dest(config.css));
    });

    gulp.task('build:css', ['compile:scss'], function () {
        return gulp.src(config.allcss)
            .pipe(concatCss("site.css", {
                inlineImports: false
            }))
            .pipe(cssNano())
            .pipe(rename('site.min.css'))
            .pipe(gulp.dest(config.buildCss));
    });

    gulp.task('inject:css', ['compile:scss'], function () {
        var sources = gulp.src(config.allcss, { read: false });

        return gulp.src(config.index)
        // .pipe(wiredep(wiredepOptions))
            .pipe(inject(sources))
            .pipe(gulp.dest(config.client));
    });

    gulp.task('compile:ts', function () {
        var stream = gulp.src(config.allClientTs)
            .pipe(ts({

            }));

        var client = stream.pipe(gulp.dest(config.clientJs));
        var build = stream.pipe(concat('app.js')).pipe(uglify()).pipe(gulp.dest(config.buildJs));

        return merge(client, build);
    });

    gulp.task('build:dist', ['fonts'], function () {
        var appJSStream = gulp.src(config.allClientTs)
            .pipe(ts())
            .pipe(concat('app.js'))
            .pipe(uglify())
            .pipe(gulp.dest(config.buildJs));

        var appCSSStream = gulp.src([config.scss, config.bower.directory + '/font-awesome/scss/font-awesome.scss'])
            .pipe(sass().on('on', sass.logError))
            .pipe(concat('app.css'))
            .pipe(cssNano())
            .pipe(gulp.dest(config.buildCss));

        var appStream = merge(appJSStream, appCSSStream);

        var bowerWithMin = bowerFiles().map(function (path, index, arr) {
            var newPath = path.replace(/.([^.]+)$/g, '.min.$1');
            return exists(newPath) ? newPath : path;
        });

        var jsFilter = filter('*.js');
        var cssFilter = filter('*.css');

        var bowerFilesStream = gulp.src(bowerWithMin);

        var bowerJSStream = bowerFilesStream
            .pipe(jsFilter)
            .pipe(concat('vendor.js'))
            .pipe(gulp.dest(config.buildJs));

        var bowerCSSStream = bowerFilesStream
            .pipe(cssFilter)
            .pipe(concat('vendor.css'))
            .pipe(gulp.dest(config.buildCss));

        var bowerStream = merge(bowerJSStream, bowerCSSStream);

        var templateCacheStream = gulp.src(config.htmltemplates)
            .pipe(templateCache({
                // module:'favoriteScraper'
            }))
            .pipe(gulp.dest(config.buildJs));

        return gulp.src(path.join(config.serverViews, 'index.html'))
            .pipe(inject(bowerStream, { name: 'build-vendor', ignorePath: config.build }))
            .pipe(inject(appStream, { name: 'build-app', ignorePath: config.build }))
            .pipe(inject(templateCacheStream, { name: 'build-templates', ignorePath: config.build }))
            .pipe(gulp.dest(config.build));
    });

    gulp.task('build:js', ['compile:ts'], function () {
        return gulp.src(config.clientJs)
            .pipe(uglify())
            .pipe(gulp.dest(config.buildJs));
    });

    gulp.task('inject:js', function () {
        var js = config.js;
        var sources = gulp.src(js, { read: false });

        return gulp.src(config.index)
            .pipe(wiredep(wiredepOptions))
            .pipe(inject(sources))
            .pipe(gulp.dest(config.client))
    });

    gulp.task('inject:bower', function () {
        var sources = gulp.src(bowerFiles(), { read: false });

        return gulp.src(config.index)
            .pipe(inject(sources, { name: 'bower' }))
            .pipe(gulp.dest(config.client))
    });

    gulp.task('inject:build', [], function () {
        var bowerStream = gulp.src(bowerFiles(), { read: false })
            .pipe(concat('vendors.js'))
            .pipe(gulp.dest(config.buildJs));

        var appStream = gulp.src(config.clientJs, { read: false })
            .pipe(uglify())
            .pipe(gulp.dest(config.buildJs));

        var sources = merge(bowerStream, appStream);

        return gulp.src(config.build + 'index.html')
            .pipe(inject(merge(sources)))
            .pipe(gulp.dest(config.build));
    });

    gulp.task('inject', ['inject:js', 'inject:bower', 'inject:css']);

    gulp.task('watch:ts', function () {
        return gulp.watch('./client/ts/**/*.ts', ['compile:ts']);
    });

    gulp.task('clean:temp', function () {
        return del([config.temp]);
    });

    gulp.task('clean:build', function () {
        return del([config.build]);
    });

    gulp.task('clean', ['clean:build', 'clean:temp'], function () { });

    gulp.task('build', ['compile:scss', 'compile:ts', /*'lint',*/ 'inject'], function () { });

    // The default task (called when you run `gulp` from cli)
    gulp.task('default', ['build', 'nodemon', 'watch']);
    gulp.task('debug', ['build', 'nodemon:debug', 'watch']);

} ());
