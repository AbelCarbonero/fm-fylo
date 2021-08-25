//HTML
import htmlmin from 'gulp-htmlmin';

//CSS
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

//Javascript
import gulp from 'gulp';
import babel from 'gulp-babel';
import terser from 'gulp-terser';

//Pug
import pug from 'gulp-pug';

//SASS
import gulpsass from 'gulp-sass';

//Common
import concat from 'gulp-concat';

//Clean Css
import clean from 'gulp-purgecss'

//Cache bust
import cacheBust from 'gulp-cache-bust' //se coloca en la parte pug o html-min si no utilizamos pug

//Browser Sync
import {init as server, stream, reload} from 'browser-sync'



//Variables / Constantes
const cssPlugins = [
  cssnano(),
  autoprefixer(),
];
const production = false; //Se cambia a true cuando el proyecto esta terminado
const sass = require('gulp-sass')(require('sass'));

//Tareas
gulp.task('html-min', () => {
  return gulp.src('./src/*.html')
  
    .pipe(
      htmlmin({
        collapseWhitespace: true, //quitamos espacios en blanco del html
        removeComments: true, //quitamos comentarios
      })
    )
    .pipe(gulp.dest('./public'));
});

gulp.task('styles', () => {
  return gulp.src('./src/css/*.css')
  
    .pipe(concat('styles-min.css'))
    .pipe(postcss(cssPlugins))
    .pipe(gulp.dest('./public/css'))
    .pipe(stream()) 
});

gulp.task('babel', () => {
  return gulp.src('./src/js/*.js')
  
    .pipe(concat('scripts-min.js'))
    .pipe(babel())
    .pipe(terser())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('views', () => {
  return gulp.src('./src/views/pages/*.pug')
  
    .pipe(
      pug({
        pretty: production ? false : true, //que lo modifique si es el archivo que vamos a subir a produccion
      })
    )
    .pipe(cacheBust({
      type: 'timestamp'
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('sass', () => {
  return gulp.src('./src/scss/styles.scss')
  
    .pipe(sass({
      outputStyle:'compressed'
    }))
    .pipe(gulp.dest('./public/css'))
    .pipe(stream()) 
});

gulp.task('clean', () => {
  return gulp.src('./public/css/styles.css')
 
    .pipe(clean({
      content: ['./public/*.html']
    }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('default', () => {

  server({
    server: './public'
  })
  //*gulp.watch('./src/*.html', gulp.series('html-min')).on('change', reload); Si se trabaja con html puro y no Pug
  //*gulp.watch('./src/css/*.css', gulp.series('styles')); si se trabaja con css puro y no con Sass
  gulp.watch('./src/views/**/*.pug', gulp.series('views')).on('change', reload); 
  gulp.watch('./src/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('./src/js/*.js', gulp.series('babel')).on('change', reload);;
  //Ruta y metodo donde vigila los cambios y que hacer = .paralel en lugar de .series cuando queramos que todo se ejecute simultaneamennte y pisandose unas a otras, depende del projecto
});
