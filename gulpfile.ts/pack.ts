import gulp from 'gulp'
import fs from 'fs'
import paths from './gulp.path'
import * as builder from "electron-builder";

const config = require("../package.json");

const { Platform } = builder;

function clean() {
	if (fs.existsSync(paths.output.release))
		fs.rmSync(paths.output.release, { recursive: true });

	return Promise.resolve();
}

function release() {
	let platform = Platform.current();
	return builder.build({
		targets: platform.createTarget(),
		config: {
			appId: `fr.${config.author}.${config.name}`,
			productName: config.name,
			copyright: `Copyright © 2020 ${config.author}`,
			directories: {
				buildResources: "resources",
				output: "release"
			},
			files: ["./dist/**/*"],
			win: {
				target: "portable"
			},
			remoteBuild: true
		}
	})
}

export default gulp.series(clean, release);