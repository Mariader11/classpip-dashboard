'use strict';

var gulp = require('gulp');
var coveralls = require('gulp-coveralls');

gulp.task('coveralls', function () {

  if (!process.env.TRAVIS) return;
  return gulp.src('coverage/coverage.lcov').pipe(coveralls());
});
