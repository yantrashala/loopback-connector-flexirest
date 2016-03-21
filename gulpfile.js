'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var runSequence = require('run-sequence');
var eslint = require('gulp-eslint');
var path     = require('path');
var fs       = require('fs');



gulp.task('eslint', function() {
  return gulp.src(['index.js', 'lib/**/*.js'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failOnError());
});

// mocha test runner
gulp.task('mochaTest', function (cb) {
  gulp.src(['index.js','lib/**/*.js'])
  .pipe(istanbul()) // Covering files
  .pipe(istanbul.hookRequire()) // Force `require` to return covered files
  .on('finish', function () {

    process.chdir('./test/flexirestTest');
    var app = require('./test/flexirestTest/server/server');

    var serverInstance = app.start();
    process.chdir('../../');
    gulp.src(['test/index-test.js','test/lib/**/*-test.js'])
    .pipe(mocha({ timeout: 10000 }))
    .pipe(istanbul.writeReports({dir:'coverage'}))// Creating the reports after tests runned
    .on('end', function(){
      serverInstance.close();
      cb();
    });
  });
});

// default task
gulp.task('default', function (callback) {
  runSequence(
    'mochaTest',
    function (error) {
      if (error) {
        console.log(error.message);
      }
      callback(error);
    });
  });
