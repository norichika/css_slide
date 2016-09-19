var gulp            = require('gulp');
var sass            = require('gulp-ruby-sass');
var plumber         = require('gulp-plumber');
var notify          = require('gulp-notify');
var cached          = require('gulp-cached');
var browserSync     = require('browser-sync');
var please          = require('gulp-pleeease');

var config = require('./config');
var path = require('./setpath');

gulp.task('sass', function() {
	return sass('src/', { style: 'expanded' })
		.pipe(cached())
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>") //<-
		}))
		.pipe(please({
			autoprefixer: {"browsers": ["last 4 versions", "Android 2.3"]},  // ベンダープレフィックス対応バージョンの指定
			minifier: false, // ビルド環境に応じて圧縮
			mqpacker: true,
		}))
		.pipe(gulp.dest('./dist/'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('ftp_upload', function() {
	gulp.src([path.html, path.js])
	.pipe(cached())
	.pipe(plumber({
		errorHandler: notify.onError("Error: <%= error.message %>") //<-
	}))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('server', function() {
	browserSync({
		server: {
		  baseDir: './dist'
		}
	});
});

gulp.task('watch', ['server'], function(){
	console.log(path);
	gulp.watch([path.html], ['ftp_upload']);
	gulp.watch([path.js], ['ftp_upload']);
	gulp.watch([path.sass], ['sass']);
});

gulp.task('default', ['watch']);