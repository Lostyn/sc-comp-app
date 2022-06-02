import gulp from 'gulp';
import sass from 'gulp-dart-sass';
import concat from 'gulp-concat';
import paths from "./gulp.path";

function fonts() {
    return gulp.src(paths.input.fonts)
        .pipe(gulp.dest(paths.output.fonts));
}

function styles() {
    return gulp.src(paths.input.styles)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat(paths.output.style))
        .pipe(gulp.dest(paths.output.html));
}

export default gulp.series(
    fonts, 
    styles
)