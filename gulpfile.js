'use strict';
var gulp = require('gulp')
var sass       = require('gulp-sass')
var concat     = require('gulp-concat')
var ngAnnotate = require('gulp-ng-annotate')
var plumber    = require('gulp-plumber')
var sourcemaps = require('gulp-sourcemaps')
var uglify     = require('gulp-uglify')


gulp.task('js', function () {
  return gulp.src(['src/shared/acerB2bModule.js','src/**/*Module.js', 'src/**/*.js'])
      .pipe(sourcemaps.init())
      .pipe(plumber())
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js'))
})

gulp.task('js:watch', ['js'], function () {
  gulp.watch('src/**/*.js', ['js'])
})

gulp.task('css', function () {
  return gulp.src('scss/**/*.scss')
    .pipe(plumber())
    .pipe(concat('app.scss'))
    .pipe(sourcemaps.init())
      .pipe(plumber()) // prevents compilation errors from killing gulp
      .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/stylesheets'))
})

gulp.task('css:watch', ['css'], function () {
  gulp.watch('scss/**/*.scss', ['css'])
})


gulp.task('default', ['js:watch', 'css:watch'])