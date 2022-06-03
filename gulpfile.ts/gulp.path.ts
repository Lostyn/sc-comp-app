
const script = "**/*.{js,ts}";
const style = "**/*.{sass,scss}";
const font = "**/*.{eot,svg,ttf,woff,woff2}";

export interface IPath {
    input: {
        html: string,
        styles: string,
        fonts: string,
        scripts: string,
        mainScripts: string,
        rendererScripts: string,
        communScripts: string
    },
    output: {
        baseDir: string,
        html: string,
        style: string,
        fonts: string,
        scripts: string,
        release: string,
    }
}

const paths: IPath = {
    input: {
        html: 'src/renderer/index.html',
        styles: `src/${style}`,
        fonts: `src/renderer/res/fonts/${font}`,
        scripts: `src/${script}`,
        mainScripts: `src/main/${script}`,
        rendererScripts: `src/renderer/${script}`,
        communScripts: `src/commun/${script}`,
    },
    output: {
        baseDir: "./dist",
        html: 'dist/renderer',
        style: 'index.css',
        fonts: 'dist/renderer/fonts',
        scripts: 'dist',
        release: 'release'
    }
}

export default paths;