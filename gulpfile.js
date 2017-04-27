var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var browserSync = require('browser-sync');

gulp.task('serve', ['build:js', 'build:css', 'copy'], function ()
{
	browserSync({
		port: 3002,
		server: {
			baseDir: 'Clockwork Chrome',
			index: 'app.html'
		}
	});

	gulp.watch
	(
		[
			'*.html',
			'**/*.css',
			'**/*.js',
			'**/*.json'
		],
		['build:js', 'build:css', 'copy', 'serve:reload'],
		{cwd: 'Clockwork Chrome'}
	)
});

gulp.task('serve:reload', ['build:js', 'build:css', 'copy'], function (done) {
    browserSync.reload();
    done();
});

gulp.task("build:js", function ()
{
	return gulp.src([
		"Clockwork Chrome/vendor/jquery/dist/jquery.js",
		"Clockwork Chrome/vendor/datatables.net/js/jquery.dataTables.js",
		"Clockwork Chrome/vendor/angular/angular.min.js",
		"Clockwork Chrome/vendor/angular-datatables/dist/angular-datatables.js",
		"Clockwork Chrome/vendor/keymaster/keymaster.js",
		"Clockwork Chrome/vendor/urijs/src/URI.js",
		"Clockwork Chrome/assets/javascripts/app.js",
		"Clockwork Chrome/assets/javascripts/panel.js",
		"Clockwork Chrome/assets/javascripts/toolbar.js"
	])
		.pipe(sourcemaps.init())
		.pipe(concat('main.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("Clockwork Chrome/assets/build"));
});


gulp.task("build:css", function ()
{
	return gulp.src([
		"Clockwork Chrome/vendor/datatables.net-dt/css/jquery.dataTables.css",
		"Clockwork Chrome/vendor/font-awesome/css/font-awesome.css",
		"Clockwork Chrome/assets/stylesheets/panel.css"
	])
		.pipe(replace(/\.\/images\//g, './build/'))
		.pipe(replace(/\.\/fonts\//g, './build/'))
		.pipe(sourcemaps.init())
		.pipe(concat('main.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("Clockwork Chrome/assets/build"));
});


gulp.task("copy", function ()
{
	return gulp.src([
		"Clockwork Chrome/vendor/font-awesome/fonts/*",
		"Clockwork Chrome/vendor/datatables.net-dt/images/*"
	])
		.pipe(gulp.dest("Clockwork Chrome/assets/build"));
});
