(function () {
    'use strict';

    var
        bowerFiles = require('main-bower-files'),
        nodemon = require('gulp-nodemon'),
        concat = require('gulp-concat'),
        // concatCss = require('gulp-concat-css'),
        // count = require('gulp-count'),
        cssNano = require('gulp-cssnano'),
        del = require('del'),
        exists = require('path-exists').sync,
        filter = require('gulp-filter'),
        gulp = require('gulp'),
        inject = require('gulp-inject'),
        jshint = require('gulp-jshint'),
        livereload = require('gulp-livereload'),
        merge = require('merge-stream'),
        path = require('path'),
        // rename = require('gulp-rename'),
        sass = require('gulp-sass'),
        templateCache = require('gulp-angular-templatecache'),
        ts = require('gulp-typescript'),
        uglify = require('gulp-uglify'),
        // useref = require('gulp-useref'),
        // util = require('gulp-util'),
        watch = require('gulp-watch'),
        _paths = ['server/**/*.js', 'client/js/**/*.js'];

    var config = require('./gulp.config')();
    var wiredep = require('wiredep').stream;
    var wiredepOptions = config.getWiredepDefaultOptions();
    
    /**===========================================================
    @Task - nodemon -- Run node application and watch with nodemon
    ============================================================*/
    gulp.task('nodemon', function () {
        return nodemon({
            script: 'server/app.js',
            env: {
                'NODE_ENV': 'production'
            }
        })
            .on('restart');
    });
  
    /**============================================================================
    @Task - nodemon:debug -- Run node application with debug and watch with nodemon
    =============================================================================*/
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

    /**=================================================================================
    @Task - watch -- Watch server and client js files for changes and trigger livereload
    ==================================================================================*/
    gulp.task('watch', function () {
        livereload.listen();
        return gulp.src(_paths, {
            read: false
        })
            .pipe(watch())
        // .pipe(jshint())
        // .pipe(jshint.reporter('default'));
        watch(_paths, livereload.changed);
    });

    /**=============================================================
    @Task - lint -- Run JSHint on server and client javascript files
    ==============================================================*/
    // gulp.task('lint', function () {
    //     gulp.src(_paths)
    //         .pipe(jshint())
    //         .pipe(jshint.reporter('default'));
    // });

    /**=============================================================
    @Task - fonts -- Copy font-awesome fonts to dev and build folder
    ==============================================================*/
    gulp.task('fonts', function () {
        var devStream = gulp.src(config.fonts)
            .pipe(gulp.dest(config.fontsDir));

        var buildStream = gulp.src(config.fonts)
            .pipe(gulp.dest(config.build));

        return merge(devStream, buildStream);
    });

    /**
     * @Task - favicon
     * Copy favicon to build folder
     */
    gulp.task('favicon', function () {
        return gulp.src(config.favicon)
            .pipe(gulp.dest(config.build));
    });

    /**================================================================================
    @Task - compile:scss -- Compile Sass style files and output in client/dev folder
    =================================================================================*/
    gulp.task('compile:scss', function () {
        return gulp.src([config.scss, config.bower.directory + '/font-awesome/scss/font-awesome.scss'])
            .pipe(sass().on('on', sass.logError))
            .pipe(gulp.dest(config.css));
    });

    /**===========================================================================
    @Task - inject:css -- Inject project CSS references into client/dev index.html
    ============================================================================*/
    gulp.task('inject:css', ['compile:scss'], function () {
        var sources = gulp.src(config.allcss, { read: false });

        return gulp.src(config.index)
        // .pipe(wiredep(wiredepOptions))
            .pipe(inject(sources))
            .pipe(gulp.dest(config.client));
    });

    /**===========================================================================
    @Task - compile:ts -- Compile Typescript files and output in client/dev folder
    ============================================================================*/
    gulp.task('compile:ts', function () {
        var stream = gulp.src(config.allClientTs)
            .pipe(ts({

            }));

        var client = stream.pipe(gulp.dest(config.clientJs));
        var build = stream.pipe(concat('app.js')).pipe(uglify()).pipe(gulp.dest(config.buildJs));

        return merge(client, build);
    });

    /**=========================================================================
    @Task - inject:js -- Inject project JS references into client/dev index.html
    ==========================================================================*/
    gulp.task('inject:js', function () {
        var js = config.js;
        var sources = gulp.src(js, { read: false });

        return gulp.src(config.index)
            .pipe(wiredep(wiredepOptions))
            .pipe(inject(sources))
            .pipe(gulp.dest(config.client))
    });
    
    /**================================================================================================
    @Task - inject:bower -- Inject third party (bower) JS and CSS references into client/dev index.html
    =================================================================================================*/
    gulp.task('inject:bower', function () {
        var sources = gulp.src(bowerFiles(), { read: false });

        return gulp.src(config.index)
            .pipe(inject(sources, { name: 'bower' }))
            .pipe(gulp.dest(config.client))
    });

    /**======================================
    @Task - inject -- Run all inject tasks
    =======================================*/
    gulp.task('inject', ['inject:js', 'inject:bower', 'inject:css']);

    /**===========================================================================
    @Task - inject:js -- Production build process
       - TS/JS
       -- Compile all Typescript files
       -- Concatinate into one app.js file
       -- Uglify
       -- Output to build/js folder
            
       - SCSS/CSS
       -- Compile site and font-awesome SCSS files
       -- Concatinate into one app.css file
       -- Minify
       -- Output to build/css folder
            
       - Bower
       -- Collect all bower files
       -- Concatinate and uglify JS files
       -- Concatinate and minify CSS files
       -- Output to respective build folders
       
       - TemplateCache
       -- Put client html files into angular $templateCache JS file
       
       - Index.html
       -- Inject production references into index.html and output to build folder 
    ============================================================================*/
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

    /**======================================
    @Task - clean:temp -- Delete .tmp folder
    =======================================*/
    gulp.task('clean:temp', function () {
        return del([config.temp]);
    });

    /**=======================================
    @Task - clean:build -- Delete build folder
    ========================================*/
    gulp.task('clean:build', function () {
        return del([config.build]);
    });

    /**======================================
    @Task - clean -- Run all clean tasks
    =======================================*/
    gulp.task('clean', ['clean:build', 'clean:temp'], function () { });

    /**========================================
    @Task - build -- Run client/dev build tasks
    =========================================*/
    gulp.task('build', ['compile:scss', 'compile:ts', /*'lint',*/ 'inject'], function () { });

    /**=========================================================================
    @Task - default -- Run build task, start production node server, watch files
    ==========================================================================*/
    gulp.task('default', ['build', 'nodemon', 'watch']);
    
    /**==================================================================
    @Task - debug -- Run build task, start debug node server, watch files
    ===================================================================*/
    gulp.task('debug', ['build', 'nodemon:debug', 'watch']);

} ());
