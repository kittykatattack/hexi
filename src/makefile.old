# ?= means the variable can be overridden from the command line like:
# make UGLIFY=./node_modules/.bin/uglify min
# This makefile requires: babel, uglifyjs and fswatch.
# fswatch runs make automatically if a file changes

#Hexi core source file
CORE_ES6 ?= src/core.js 

#Hexi core output file
CORE_ES5 ?= bin/core.js

#Pixi
PIXI ?= src/modules/pixi.js/bin/pixi.js

#The individual modules (Not including PIXI)
BUMP ?= src/modules/bump/bin/bump.js
SOUND ?= src/modules/sound.js/sound.js
SCALE_TO_WINDOW ?= src/modules/scaleToWindow/scaleToWindow.js
CHARM ?= src/modules/charm/bin/charm.js
TINK ?= src/modules/tink/bin/tink.js
DUST ?= src/modules/dust/bin/dust.js
SPRITE_UTILITIES ?= src/modules/spriteUtilities/bin/spriteUtilities.js
GAME_UTILITIES ?= src/modules/gameUtilities/bin/gameUtilities.js
SMOOTHIE ?= src/modules/smoothie/bin/smoothie.js
TILE_UTILITIES ?= src/modules/tileUtilities/bin/tileUtilities.js
#The experimental fullscreen feature has been removed for now
#FULLSCREEN ?= src/modules/fullScreen/bin/fullScreen.js

#Concatenated modules
ES5_MODULES := ${SOUND} $(SCALE_TO_WINDOW) ${BUMP} ${CHARM} ${TINK} ${DUST} ${SPRITE_UTILITIES} ${GAME_UTILITIES} ${SMOOTHIE} ${TILE_UTILITIES}

#The concatenated modules output file (exluding PIXI)
MODULES ?= bin/modules.js

#The total concatenated output of all the files (Including PIXI)
OUTPUT ?= bin/hexi.js

#The minified output file
MINIFIED_OUTPUT ?= bin/hexi.min.js

all: compile concatModules concatAllFiles minify 

compile: $(CORE_ES6)
	babel $^ --out-file $(CORE_ES5) --source-maps

minify: $(OUTPUT)
	uglifyjs $(OUTPUT) --output $(MINIFIED_OUTPUT)

concatModules: $(ES5_MODULES) 
	cat $^ > $(MODULES)

concatAllFiles: 
	cat $(PIXI) $(MODULES) $(CORE_ES5) > $(OUTPUT)

watchSrc: $(CORE_ES6)
	babel $^ --watch --out-file $(CORE_ES5) --source-maps

watchExamples:
	babel examples/src --watch --out-dir examples/bin --source-maps

watchTutorials:
	babel tutorials/src --watch --out-dir tutorials/bin --source-maps
    
