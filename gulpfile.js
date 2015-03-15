'use strict';
// FAPP-STACK Gulpfile
// -------------------------------------
// This file processes all of the assets in the "client" folder, combines them with the Foundation
// for Apps assets, and outputs the finished files in the buildFolder (which is configurable below)
// folder as a finished app.
// 1. LIBRARIES
// - - - - - - - - - - - - - - -
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    rimraf = require('rimraf'),
    sequence = require('run-sequence'),
    router = require('./bower_components/foundation-apps/bin/gulp-dynamic-routing');
// 2. SETTINGS VARIABLES
// - - - - - - - - - - - - - - -
var buildFolder = 'www';
// Sass will check these folders for files when you use @import.
var sassPaths = ['client/assets/scss', 'bower_components/foundation-apps/scss'];
// These files include Foundation for Apps and its dependencies
var foundationJS = ['bower_components/fastclick/lib/fastclick.js', 'bower_components/viewport-units-buggyfill/viewport-units-buggyfill.js', 'bower_components/tether/tether.js', 'bower_components/lodash/lodash.min.js', 'bower_components/angular/angular.js', 'bower_components/angular-modal-service/dst/angular-modal-service.min.js', 'bower_components/a0-angular-storage/dist/angular-storage.min.js', 'bower_components/angular-jwt/dist/angular-jwt.min.js', 'bower_components/angular-animate/angular-animate.js', 'bower_components/angular-ui-router/release/angular-ui-router.js', 'bower_components/foundation-apps/js/vendor/**/*.js', 'bower_components/foundation-apps/js/angular/**/*.js', '!bower_components/foundation-apps/js/angular/app.js'];
// These files are for your app's JavaScript
var appJS = ['client/assets/modules/app.js', 'client/assets/modules/**/*.js'];
// 3. TASKS
// - - - - - - - - - - - - - - -
// Cleans the build directory
gulp.task('clean', function (cb) {
    rimraf('./' + buildFolder, cb);
});
// Copies user-created files and Foundation assets
gulp.task('copy', function () {
    var dirs = ['./client/**/*.*', '!./client/assets/{scss,modules}/**/*.*'];
    // Everything in the client folder except templates, Sass, and JS
    gulp.src(dirs, {
        base: './client/'
    })
        .pipe(gulp.dest('./' + buildFolder));
    //font-awesome icon-font
    gulp.src('./bower_components/font-awesome/fonts/**/*')
        .pipe(gulp.dest('./' + buildFolder + '/assets/fonts/'));
    // Foundation's Angular partials
    return gulp.src(['./bower_components/foundation-apps/js/angular/components/**/*.html'])
        .pipe(gulp.dest('./' + buildFolder + '/components/'))
        .pipe($.livereload());
});
// Compiles Sass
gulp.task('sass', function () {
    return gulp.src('client/assets/scss/app.scss')
        .pipe($.sass({
            includePaths: sassPaths,
            outputStyle: 'nested',
            errLogToConsole: true
        }))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions', 'ie 10']
        }))
        .pipe(gulp.dest('./' + buildFolder + '/assets/css/'))
        .pipe($.livereload());
});
// Compiles and copies the Foundation for Apps JavaScript, as well as your app's custom JS
gulp.task('uglify', function () {
    // Foundation JavaScript
    gulp.src(foundationJS)
        .pipe($.uglify({
                beautify: true,
                mangle: false
            })
            .on('error', function (e) {
                console.log(e);
            }))
        .pipe($.concat('foundation.js'))
        .pipe(gulp.dest('./' + buildFolder + '/assets/js/'));
    // App JavaScript
    return gulp.src(appJS)
        .pipe($.ngAnnotate({
            remove: true,
            add: true,
            single_quotes: true
        }))
        .pipe($.uglify({
                beautify: true,
                mangle: false
            })
            .on('error', function (e) {
                console.log(e);
            }))
        .pipe($.concat('app.js'))
        .pipe(gulp.dest('./' + buildFolder + '/assets/js/'))
        .pipe($.livereload());
});
// Copies your app's page templates and generates URLs for them
gulp.task('copy-templates', ['copy'], function () {
    return gulp.src('./client/assets/modules/**/templates/**/*.html')
        .pipe($.rename(function (path) {
            path.dirname = '/templates/' + path.dirname.replace('/templates', '');
        }))
        .pipe(router({
            path: buildFolder + '/assets/js/routes.js',
            root: 'client/assets/modules/'
        }))
        .pipe(gulp.dest('./' + buildFolder))
        .pipe($.livereload());
});
gulp.task('backend:start', function () {
    $.nodemon({
        script: './backend/server.js',
        ext: 'html js',
        watch: ['backend'],
        env: {
            'NODE_ENV': 'development',
            'DEBUG': 'app:*'
        }
    })
        .on('restart', function () {
            console.log('api restarted!');
        });
});
// Builds your entire app once, without starting a server
gulp.task('build', function (cb) {
    sequence('clean', ['copy', 'sass', 'uglify'], 'copy-templates', function () {
        console.log('Successfully built.');
        // Notify gulp that build has completed
        cb();
    });
});
// Default task: builds your app, starts a server, and recompiles assets when they change
gulp.task('default', function () {
    //Start livereload-server
    $.livereload.listen({
        quiet: true
    });
    // Run the server after the build
    sequence(['build', 'backend:start']);
    // Watch Sass
    gulp.watch(['./client/assets/scss/**/*', './scss/**/*'], ['sass']);
    // Watch JavaScript
    gulp.watch(['./client/assets/modules/**/*.js', './js/**/*'], ['uglify']);
    // Watch static files
    gulp.watch(['./client/**/*.*', '!./client/assets/modules/**/templates/**/*', '!./client/assets/{scss,modules}/**/*.*'], ['copy']);
    // Watch app templates
    gulp.watch(['./client/assets/modules/**/*.html'], ['copy-templates']);
    // Watch gulpfile.js
    gulp.watch(['./gulpfile.js'], ['build']);
});