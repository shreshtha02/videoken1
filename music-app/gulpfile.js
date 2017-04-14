var gulp = require('gulp')
var debug = require('gulp-debug')
var connect = require('gulp-connect')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var minify = require('gulp-minify');
var gutil = require('gulp-util');
var clean = require('gulp-clean');

gulp.task('connect', function() {
	connect.server({
		root: 'public',
		port: 4000
		})
})
gulp.task('browserify', function() {
    // Grabs the app.js file
    return browserify('./app/app.js')
        // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./public/js/'));
})
gulp.task('mini', function() {
	 gulp.src('./public/js/main.js')
	.pipe(minify({ext:{min:'.min.js'}}).on('error',gutil.log))
	.pipe(gulp.dest('./public/js/'));
})
gulp.task('compress', ['clean'], function() {
  return gulp.src('./public/js/*.js')
    .pipe(debug({title: 'processing:'}))
    .pipe(minify({
        ext:{
            src:'.js',
            min:'-min.js'
        },
        ignoreFiles: ['-min.js']
    }).on('data',gutil.log))
    .pipe(debug({title: 'done:'}))
    .pipe(gulp.dest('./public/js/').on('data',gutil.log))
});
gulp.task('watch', function() {
    gulp.watch('app/**/*.js', ['browserify'])
})
gulp.task('clean', function() {
	return gulp.src('public/js/*min.js', {read: false})
        .pipe(clean());
})
gulp.task('minify', ['clean','compress'])
gulp.task('default', ['connect', 'watch'])
