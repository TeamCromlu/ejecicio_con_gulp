var gulp = require('gulp');
var watch = require('gulp-watch')

var jade = require('gulp-jade');
var stylus = require('gulp-stylus');

var browserify = require('browserify'); 
var watchify = require('watchify'); 
var source = require('vinyl-source-stream');


var entry = './lib/main.js'; //Script de entrada 
var args = watchify.args; 
// args.debug = true; //Genera el sourcemap para debuguear
// args.fullPaths = false; //Evita el uso de paths absolutos 
var bundler = watchify(browserify(entry, args));

function createBundle(){ 
    console.log('Nuevo JS generado...'); 
    return bundler.bundle() 
        .pipe(source('bundle.js')) //Nombre del bundle final --puede ser cualquier nombre(no necesariamente bundle)
        .pipe(gulp.dest('./public/js')); //Directorio de destino
} 

gulp.task('dev', createBundle); 
bundler.on('update', createBundle); //A cada modificación generamos un nuevo bundle 

//Proporcionamos algo de información al generar el bundle
bundler.on('time', function(time){ 
    console.log('Done at ' + (time/1000)); 
});



gulp.task('jade', function(){
    console.log('Nuevo Html generado...'); 
	gulp.src('./lib/index.jade') //ruta del archivo de jade
	.pipe(jade())
	.pipe(gulp.dest('')) //ruta del archivo donde se va a generar el html
});

gulp.task('stylus', function(){
    console.log('Nuevo Css generado...'); 
	gulp.src('./lib/app.styl') //ruta del archivo de styl
	.pipe(stylus({
		compress: false
	}))
	.pipe(gulp.dest('./public/css')) //ruta del archivo donde se va a generar el css
})

gulp.task('watch', function () { //se encarga de ver cada uno de los plugins
   gulp.watch(['./lib/index.jade'], ['jade']);
   gulp.watch(['./lib/app.styl'], ['stylus']);
});


gulp.task('default', ['stylus','jade','dev','watch']); //ejecuta y ve si se hacen modificaciones en los archivos jade,stylus,js