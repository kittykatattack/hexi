###
#
# @file gulpfile.coffee
# @author Matt Lima [matt@3-tone.com]
# @see src/core.js for comments about the original build system
# @see src/makefile.old, the original build file
#
#
###


###
#
# The Core file(s)
#
###
CORE = "src/core.js"

###
#
# The individual modules (Not including PIXI).
#
###
BUMP              = "src/modules/bump/bin/bump.js"
SOUND             = "src/modules/sound.js/sound.js"
SCALE_TO_WINDOW   = "src/modules/scaleToWindow/scaleToWindow.js"
CHARM             = "src/modules/charm/bin/charm.js"
TINK              = "src/modules/tink/bin/tink.js"
DUST              = "src/modules/dust/bin/dust.js"
SPRITE_UTILITIES  = "src/modules/spriteUtilities/bin/spriteUtilities.js"
GAME_UTILITIES    = "src/modules/gameUtilities/bin/gameUtilities.js"
SMOOTHIE          = "src/modules/smoothie/bin/smoothie.js"
TILE_UTILITIES    = "src/modules/tileUtilities/bin/tileUtilities.js"
#The experimental fullscreen feature has been removed for now
#FULLSCREEN       = "src/modules/fullScreen/bin/fullScreen.js"



hexiModuleSources = [
  SOUND
  SCALE_TO_WINDOW
  BUMP
  CHARM
  TINK
  DUST
  SPRITE_UTILITIES
  GAME_UTILITIES
  SMOOTHIE
  TILE_UTILITIES
]


###
#
# PIXI source location
#
###
PIXI = "src/modules/pixi.js/bin/pixi.js"









gulp = require "gulp"
del = require "del"

###
# Load Gulp Plugins. Instead of specifying each Gulp plugin individually,
# search package.json and automatically include them as plugins.pluginName().
# @type {object}
# @external "gulpLoadPlugins"
# @see {@link https://www.npmjs.com/package/gulp-load-plugins}
###
gulpLoadPlugins = require("gulp-load-plugins")
plugins = gulpLoadPlugins(
  pattern: [
    "gulp-*"
    "gulp.*"
  ]
  replaceString: /\bgulp[\-.]/)


gulp.task "clean:all", (done)->
  del "bin"
  .then ()=>
    done()

gulp.task "compile:core", (done)->
  gulp.src CORE
  .pipe plugins.sourcemaps.init()
  .pipe plugins.babel()
  .pipe plugins.sourcemaps.write "."
  .pipe gulp.dest "bin"
  done()


gulp.task "compile:modules", (done)->
  gulp.src hexiModuleSources
  .pipe plugins.sourcemaps.init()
  .pipe plugins.concat "modules.js"
  .pipe plugins.babel
    presets: ["env"]
    plugins: ["transform-remove-strict-mode"]
  .pipe plugins.sourcemaps.write "."
  .pipe gulp.dest "bin"
  done()




gulp.task "compile:hexi", (done)->
  hexiFullSource = hexiModuleSources
  hexiFullSource.unshift PIXI
  hexiFullSource.push CORE
  vanillaSrc = gulp.src hexiFullSource
  .pipe plugins.sourcemaps.init
    largeFile: true
  .pipe plugins.concat "hexi.js"
  .pipe plugins.babel
    compact: false
  .pipe plugins.sourcemaps.write "."
  .pipe gulp.dest "bin"
  done()


gulp.task "compile:hexi-min", (done)->
  hexiFullSource = hexiModuleSources
  hexiFullSource.unshift PIXI
  hexiFullSource.push CORE
  vanillaSrc = gulp.src hexiFullSource
  .pipe plugins.sourcemaps.init
    largeFile: true
  .pipe plugins.concat "hexi.min.js"
  .pipe plugins.babel
    compact: false
  .pipe plugins.uglify
    mangle: false
  .pipe plugins.sourcemaps.write "."
  .pipe gulp.dest "bin"
  done()





gulp.task "compile:all", gulp.parallel ["compile:core","compile:modules","compile:hexi","compile:hexi-min"]

gulp.task "watch", (done)->
  gulp.watch "src/**/*.js", gulp.series "clean:all", "compile:all"

gulp.task "default", gulp.series ["clean:all", "compile:all", "watch"]
