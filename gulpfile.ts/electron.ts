import gulp from 'gulp';
import electronConnect from 'electron-connect';
import paths from './gulp.path';
import scripts from './scripts';
import template from './template';
import styles from './styles';

const electronServer = electronConnect.server.create({
    port: 30030,
    stopOnClose: true
})
let onDone;
const callback = function(electronProcState) {
    console.log('electron process state: ' + electronProcState);
    if (electronProcState == 'stopped') {
        onDone();
        process.exit();
    }
};

const reload = (done) => {
    electronServer.reload();
    done();
}

const restart = (done) => {
    electronServer.restart();
    done();
}

export default function electron(done) {
    onDone = done;
    electronServer.start(callback);

    gulp.watch(paths.input.scripts.main, gulp.series(scripts.main.compile, restart));

    gulp.watch(paths.input.html, gulp.series(template, reload));
    gulp.watch(paths.input.styles, gulp.series(styles, reload));
    gulp.watch(paths.input.scripts.renderer, gulp.series(scripts.renderer.compile, reload));

    return onDone;
}