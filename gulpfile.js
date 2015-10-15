var gulp = require('gulp');
var electron = require('gulp-electron');
var gulpAsar = require('gulp-asar');
var packageJson = require('./package.json');

gulp.task('default', function() {
    gulp.src("")
    .pipe(electron({
        src: './src',
        packageJson: packageJson,
        release: './gulp/release',
        cache: './gulp/cache',
        version: 'v0.33.8',
        packaging: true,
        platforms: ['darwin-x64', 'win32-ia32', 'win32-x64', 'linux-ia32', 'linux-x64'],
        platformResources: {
            darwin: {
                CFBundleDisplayName: packageJson.name,
                CFBundleIdentifier: 'xyz.lumios.eew',
                CFBundleName: packageJson.name,
                CFBundleVersion: packageJson.version,
                icon: './src/resources/eew.icns'
            },
            win: {
                "version-string": packageJson.version,
                "file-version": packageJson.version,
                "product-version": packageJson.version,
                "icon": './src/resources/eew-icon-win.png'
            },

        }
    }))
    .pipe(gulp.dest("./gulp/out"));
});
