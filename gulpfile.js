var gulp     = require('gulp');
var uglify   = require('gulp-uglify');
var sass     = require('gulp-ruby-sass');
var cssmin   = require('gulp-minify-css');
var htmlmin  = require('gulp-htmlmin');

var paths    = {
    'scripts': ['dev/js/*.js'],
    'styles' : ['dev/*.scss', 'dev/scss/*.scss'],
    'html'   : ['dev/*.html']
};

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(uglify({preserveCOmments: 'some'}))
        .pipe(gulp.dest('public/js'));
});

gulp.task('sass', function() {
    return gulp.src(paths.styles)
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest('public'));
});

gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['sass']);
    gulp.watch(paths.html, ['html']);
});

gulp.task('default', ['scripts', 'sass', 'html', 'watch']);