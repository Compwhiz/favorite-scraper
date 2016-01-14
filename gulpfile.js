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
        _paths = ['server/**/*.js', 'client/js/**/*.js'];

    var config = require('./gulp.config')();
    var wiredep = require('wiredep').stream;
    var wiredepOptions = config.getWiredepDefaultOptions();
    
    //register nodemon task
    gulp.task('nodemon', function () {
        nodemon({
            script: 'server/app.js',
            env: {
                'NODE_ENV': 'development'
            }
        })
            .on('restart');
    });
  
    //register nodemon task
    gulp.task('nodemon:debug', function () {
        nodemon({
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
            .pipe(watch({
                emit: 'all'
            }))
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
        watch(_paths, livereload.changed);
    });

    //lint js files
    gulp.task('lint', function () {
        gulp.src(_paths)
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });

    gulp.task('fonts', function () {
        gulp.src(config.fonts)
            .pipe(gulp.dest(config.fontsDir));
    });

    gulp.task('compile:ts', function () {
        gulp.src('./client/ts/**/*.ts')
            .pipe(ts({

            }))
            .pipe(gulp.dest('./client/js/'));
    });

    gulp.task('compile:scss', function () {
        gulp.src([config.scss, config.bower.directory + '/font-awesome/scss/font-awesome.scss'])
            .pipe(sass().on('on', sass.logError))
            .pipe(gulp.dest(config.css));
    });

    gulp.task('inject:css', ['compile:scss'], function () {
        var sources = gulp.src(config.allcss, { read: false });

        return gulp.src(config.index)
        // .pipe(wiredep(wiredepOptions))
            .pipe(inject(sources))
            .pipe(gulp.dest(config.serverViews));
    });

    gulp.task('inject:js', function () {
        var js = config.js;
        var sources = gulp.src(js, { read: false });

        return gulp.src(config.index)
            .pipe(wiredep(wiredepOptions))
            .pipe(inject(sources))
            .pipe(gulp.dest(config.serverViews))
    });

    gulp.task('inject:bower', function () {
        var sources = gulp.src(bowerFiles(), { read: false });

        return gulp.src(config.index)
            .pipe(inject(sources, { name: 'bower' }))
            .pipe(gulp.dest(config.serverViews))
    });

    gulp.task('inject', ['inject:js', 'inject:bower', 'inject:css']);

    gulp.task('watch:ts', function () {
        gulp.watch('./client/ts/**/*.ts', ['compile:ts']);
    });

    gulp.task('build', ['compile:scss', 'compile:ts', /*'lint',*/ 'inject'], function () { });

    // The default task (called when you run `gulp` from cli)
    gulp.task('default', ['build', 'nodemon', 'watch']);
    gulp.task('debug', ['build', 'nodemon:debug', 'watch']);

} ());
