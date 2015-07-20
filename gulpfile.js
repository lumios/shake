var uglify = require('gulp-uglify');
var gulp = require("gulp");
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var builder = require('gulp-node-webkit-builder');

gulp.task('compress', function() {

  return browserify('./src/client.js').ignore("nw.gui").bundle().pipe(source('bundle.js')).pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./src/bin/'));
});
gulp.task('scripts', function() {
  return gulp.src(['./src/**/*'])
    .pipe(builder({
        version: 'v0.9.2',
        platforms: ['win64']
     }));
});
