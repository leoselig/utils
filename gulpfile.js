var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var mochaPhantomJS = require('gulp-mocha-phantomjs');

// Config loading
var config = JSON.parse(
    require('fs').readFileSync('build/config.json')
);

// Tasks

gulp.task('source.build', function() {
    gulp.src(config.target)
        .pipe(plugins.clean());

    gulp.src(config.src + config.srcEntryFile)
        .pipe(plugins.browserify({
            debug: config.debug,
            standalone: 'webutils'
        }))
        .pipe(plugins.rename(
            config.target + config.targetBuildFile
        ))
        .pipe(gulp.dest('./'));
});

gulp.task('demo.copyBuild', function() {
    gulp.src(config.target + config.targetBuildFile)
        .pipe(plugins.rename(
            config.demo + config.demoBuildFile
        ))
        .pipe(gulp.dest('./'));
});

gulp.task('test.build', function() {
    gulp.src(config.test + config.testEntryFile)
        .pipe(plugins.browserify({
            debug: config.debug
        }))
        .pipe(plugins.rename(
            config.testBuildFile
        ))
        .pipe(gulp.dest(config.test));
});

gulp.task('demo.build', function() {
    gulp.start('source.build', 'demo.copyBuild');
});

gulp.task('test.run', function() {
    gulp.src('test/runner.html')
        .pipe(mochaPhantomJS());
});

gulp.task('test', function() {
    gulp.start('test.build', 'test.run');
});

gulp.task('watch.buildDemo', function() {
    plugins.watch(config.src + '**/*.js', function() {
        gulp.start('demo.build')
    });
});

gulp.task('watch.runTest', function() {
    plugins.watch(config.src + '**/*.js', function() {
        gulp.start('test')
    });
});

gulp.task('default', function() {
    gulp.start('source.build');
});
