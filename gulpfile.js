var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// watch files for changes and reload
gulp.task('serve', function() {
	browserSync({
		server: {
			baseDir: 'Clockwork Chrome',
			index: 'app.html'
		}
	});

	gulp.watch(['*.html', '**/*.css', '**/*.js', '**/*.json'], {cwd: 'Clockwork Chrome'}, reload);
});
