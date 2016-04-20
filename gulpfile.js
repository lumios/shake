var gulp = require('gulp');
var electron = require('gulp-electron');
var pkg = require('./src/package.json');

var version = pkg.dependencies['electron-prebuilt'].replace('^', 'v');

gulp.task('build:all', () => {
    gulp.src('')
    .pipe(electron({
        src: './src/',
        packageJson: pkg,
        release: './build/release',
        cache: './build/cache',
        version: version,
        packaging: true,
        platforms: [ 'darwin-x64', 'win32-ia32', 'win32-x64', 'linux-ia32', 'linux-x64', 'linux-arm' ],
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
            }
        }
    }));
});

gulp.task('build:mac', () => {
    gulp.src('')
    .pipe(electron({
        src: './src/',
        packageJson: pkg,
        release: './build/release',
        cache: './build/cache',
        version: version,
        packaging: true,
        platforms: [ 'darwin-x64' ],
        platformResources: {
            darwin: {
                CFBundleDisplayName: pkg.name,
                CFBundleIdentifier: 'xyz.lumios.shake',
                CFBundleName: pkg.name,
                CFBundleVersion: pkg.version,
                icon: './src/resources/IconMac.icns'
            }
        }
    }));
});

gulp.task('build:win32', () => {
    gulp.src('')
    .pipe(electron({
        src: './src/',
        packageJson: pkg,
        release: './build/release',
        cache: './build/cache',
        version: version,
        packaging: true,
        platforms: [ 'win32-ia32' ],
        platformResources: {
            win: {
                "version-string": pkg.version,
                "file-version": pkg.version,
                "product-version": pkg.version,
                "icon": './src/resources/IconWindows.ico'
            }
        }
    }));
});

gulp.task('build:win64', () => {
    gulp.src('')
    .pipe(electron({
        src: './src/',
        packageJson: pkg,
        release: './build/release',
        cache: './build/cache',
        version: version,
        packaging: true,
        platforms: [ 'win32-x64' ],
        platformResources: {
            win: {
                "version-string": pkg.version,
                "file-version": pkg.version,
                "product-version": pkg.version,
                "icon": './src/resources/IconWindows.ico'
            }
        }
    }));
});

gulp.task('build:linux32', () => {
    gulp.src('')
    .pipe(electron({
        src: './src/',
        packageJson: pkg,
        release: './build/release',
        cache: './build/cache',
        version: version,
        packaging: true,
        platforms: [ 'linux-ia32' ]
    }));
});

gulp.task('build:linux64', () => {
    gulp.src('')
    .pipe(electron({
        src: './src/',
        packageJson: pkg,
        release: './build/release',
        cache: './build/cache',
        version: version,
        packaging: true,
        platforms: [ 'linux-x64' ]
    }));
});

gulp.task('build:arm', () => {
    gulp.src('')
    .pipe(electron({
        src: './src/',
        packageJson: pkg,
        release: './build/release',
        cache: './build/cache',
        version: version,
        packaging: true,
        platforms: [ 'linux-arm' ]
    }));
});
