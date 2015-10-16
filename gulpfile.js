var gulp = require('gulp');
var electron = require('gulp-electron');
var asar = require('gulp-asar');
var shell = require('gulp-shell');
var pkg = require('./package.json');

gulp.task('default', function() {
    gulp.src("")
    .pipe(electron({
        src: './src',
        packageJson: pkg,
        release: './gulp/release',
        cache: './gulp/cache',
        version: 'v0.33.8',
        packaging: true,
        platforms: ['darwin-x64', 'win32-ia32', 'win32-x64', 'linux-ia32', 'linux-x64'],
        platformResources: {
            darwin: {
                CFBundleDisplayName: pkg.name,
                CFBundleIdentifier: 'xyz.lumios.eew',
                CFBundleName: pkg.name,
                CFBundleVersion: pkg.version,
                icon: './src/resources/eew.icns'
            },
            win: {
                "version-string": pkg.version,
                "file-version": pkg.version,
                "product-version": pkg.version,
                "icon": './src/resources/eew-icon-win.png'
            },

        }
    }))
    .pipe(gulp.dest("./gulp/out"));
});
