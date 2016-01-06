(function () {
  'use strict';

  var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    watch = require('gulp-watch'),
    jshint = require('gulp-jshint'),
    livereload = require('gulp-livereload'),
    ts = require('gulp-typescript'),
    inject = require('gulp-inject'),
    count = require('gulp-count'),
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

  gulp.task('compile:ts', function () {
    gulp.src('./client/ts/**/*.ts')
      .pipe(ts({

      }))
      .pipe(gulp.dest('./client/js/'));
  });

  gulp.task('inject:css', function () {
    var sources = gulp.src('./client/css/**/*.css', { read: false });

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

  // The default task (called when you run `gulp` from cli)
  gulp.task('default', ['compile:ts', 'lint', 'inject:js', 'nodemon', 'watch']);

} ());
