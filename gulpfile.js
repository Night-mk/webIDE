/**
 * Created by Catter on 2016/3/9.
 */
var gulp = require("gulp");

gulp.task("jsCompile",function(){
   gulp.src("test/*.html")
       .pipe(gulp.dest("build"));
   gulp.src("test/js/*.js")
       .pipe(gulp.dest("build/js"));
   gulp.src("test/css/*.css")
       .pipe(gulp.dest("build/css"));
   gulp.src("test/img/*")
       .pipe(gulp.dest("build/img"));
});

gulp.task("default",function(){
   gulp.watch([
      "test/js/**",
      "test/css/**",
      "test/img/**"
   ],[
     "jsCompile"
   ]);
});