import gulp from 'gulp';
import ts from 'gulp-typescript';
import paths from './gulp.path';

var tsProject = ts.createProject('tsconfig.json');

function scripts() {
    return gulp.src(paths.input.scripts)
        .pipe(tsProject())
        .pipe(gulp.dest(paths.output.scripts));
}

export default scripts;