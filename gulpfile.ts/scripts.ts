import gulp from 'gulp';
import ts from 'gulp-typescript';
import paths from './gulp.path';

var tsProject = ts.createProject('tsconfig.json');

class Scripts {
    scope: string;

    constructor(scope: string) {
        this.scope = scope;
    }

    compile = () => {
        return gulp.src(paths.input.scripts[this.scope])
            .pipe(tsProject())
            .pipe(gulp.dest(paths.output.script[this.scope]));
    }
}

export default {
    main: new Scripts('main'),
    renderer: new Scripts('renderer'),
    commun: new Scripts('commun')
}