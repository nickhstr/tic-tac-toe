var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-clean-css');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');

var paths = {
	scripts: 'app/**/*.js',
	styles: 'app/styles/**/*.scss',
	html: 'app/*.html'
};

// Scripts task
gulp.task('scripts', function() {
	return gulp.src(paths.scripts)
		.pipe(uglify())
		.pipe(concat('app.min.js'))
		.pipe(gulp.dest('public'));
});

// Styles task
gulp.task('styles', function() {
	return gulp.src(paths.styles)
		.pipe(autoprefixer())
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(rename('styles.min.css'))
		.pipe(gulp.dest('public'));
});

// HTML task
gulp.task('html', function() {
	return gulp.src(paths.html)
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('public'));
});

// Default task
gulp.task('default', ['scripts', 'styles', 'html'], function() {
	console.log('Starting default task');
});

gulp.task('watch', ['default'], function() {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.styles, ['styles']);
	gulp.watch(paths.html, ['html']);
});