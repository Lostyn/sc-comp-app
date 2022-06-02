import gulp from 'gulp';
import paths from './gulp.path';
import inject from 'gulp-inject-string';

function html() {
    return gulp.src(paths.input.html)
        .pipe(inject.after('<!--:css-->', `\n\t\t<link href=\"${paths.output.style}\" rel="stylesheet">`))
        .pipe(inject.after('<!--:js-->', `\n\t<script>require('./index.js');</script>`))
        .pipe(gulp.dest(paths.output.html));
}

export default gulp.series(
    html
)