var uglify = require('gulp-uglify');
var gulp = require("gulp");
gulp.task('compress', function() {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('src/bin/*.js'));
});