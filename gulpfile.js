var gulp = require('gulp');
var electron = require('gulp-electron');
var pkg = require('./package.json');

var version = pkg['dependencies']['electron-prebuilt'].replace('^', 'v');

gulp.task('default', function() {
    gulp.src("")
    .pipe(electron({
        src: './',
        packageJson: pkg,
        release: './build/release',
        cache: './build/cache',
        version: version,
        packaging: true,
        platforms: [
            'darwin-x64', 
            'win32-ia32',
            'win32-x64', 
            'linux-ia32',
            'linux-x64'
        ],
        platformResources: {
            darwin: {
                CFBundleDisplayName: pkg.name,
                CFBundleIdentifier: 'xyz.lumios.shake',
                CFBundleName: pkg.name,
                CFBundleVersion: pkg.version,
                icon: './src/resources/IconMac.icns'
            },
            win: {
                "version-string": pkg.version,
                "file-version": pkg.version,
                "product-version": pkg.version,
                "icon": './src/resources/IconWindows.ico'
            },

        }
    }))
});

gulp.task('build:mac', function() {
    gulp.src("")
    .pipe(electron({
        src: './',
        packageJson: pkg,
        release: './build/release',
        cache: './build/cache',
        version: version,
        packaging: true,
        platforms: [
            'darwin-x64'
        ],
        platformResources: {
            darwin: {
                CFBundleDisplayName: pkg.name,
                CFBundleIdentifier: 'xyz.lumios.shake',
                CFBundleName: pkg.name,
                CFBundleVersion: pkg.version,
                icon: './src/resources/IconMac.icns'
            }
        }
    }))
});
