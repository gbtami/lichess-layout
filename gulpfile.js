const gulp = require('gulp');
const shell = require('gulp-shell');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

const roundSassInput = 'src/scss/round/**/*.scss';
const homeSassInput = 'src/scss/home/**/*.scss';
const commonSassInput = 'src/scss/common/**/*.scss';
const sassOutput = 'assets/css';

const htmlInput = 'src/html/**/*.html';
const htmlOutput = 'site/**/*.html';

const sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

const autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

const htmlBuild = shell.task('eleventy');

gulp.task('html', htmlBuild);

function sassBuilder(input) {
  return function() {
    return gulp
      .src(input)
      .pipe(sourcemaps.init())
      .pipe(sass(sassOptions).on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(autoprefixer(autoprefixerOptions))
      .pipe(gulp.dest(sassOutput))
      .pipe(browserSync.stream());
  }
}
const roundSass = sassBuilder(roundSassInput);
const homeSass = sassBuilder(roundSassInput);
const allSass = [homeSass, roundSass];

gulp.task('sass', gulp.series(allSass));

function serve() {
  browserSync.init({
    server: {
      baseDir: "."
    }
  });

  gulp.watch(roundSassInput, roundSass);
  gulp.watch(homeSassInput, homeSass);
  gulp.watch(commonSassInput, gulp.series(allSass));
  gulp.watch(htmlInput, htmlBuild);
  gulp.watch(htmlOutput).on('change', browserSync.reload);
}

gulp.task('default', gulp.series([
  htmlBuild,
  ...allSass,
  serve
]));

// function watch() {
//   return gulp
//     .watch(sassInput, sassBuild)
//     .watch(htmlInput, htmlBuild)
//     .on('change', function(event) {
//       console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
//     });
// }

// gulp.task('watch', watch);

gulp.task('prod', function () {
  return gulp
    .src(input)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(sassOutput));
});
