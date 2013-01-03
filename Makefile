
#all: checkCommands lint min minBundle debugBundle css docs
all: checkCommands      min minBundle debugBundle css docs


.PHONY: docs


updateAux:
	#@wget https://raw.github.com/toji/gl-matrix/master/dist/gl-matrix.js
	@curl -O https://raw.github.com/toji/gl-matrix/master/dist/gl-matrix.js
	@mv gl-matrix.js aux
	@cat aux/gl-matrix-patch.js >> aux/gl-matrix.js


checkCommands:
ifeq ($(shell which lessc),)
	$(error lessc not found! Do: sudo npm install -g less)
endif
ifeq ($(shell which jshint),)
	$(error jshint not found! Do: sudo npm install -g jshint)
endif
ifeq ($(shell which uglifyjs),)
	$(error uglifyjs not found! Do: sudo npm install -g uglify-js)
endif
ifeq ($(shell which yuidoc),)
	$(error yuidoc not found! Do: sudo npm install -g yuidocjs)
endif


clean:
	@rm -rf docs bin jsdev.c jsdev


$(CURDIR)/jsdev.c:
ifneq ($(shell which wget),)
	@wget https://raw.github.com/douglascrockford/JSDev/master/jsdev.c
else
	@curl -O https://raw.github.com/douglascrockford/JSDev/master/jsdev.c
endif


$(CURDIR)/jsdev: $(CURDIR)/jsdev.c
	@gcc jsdev.c -o jsdev


copyToBin:
	@mkdir -p bin
	@cp aux/gl-matrix.js bin/gl-matrix.js
	@cp aux/raf.js       bin/raf.js
	@cp src/div3d.js     bin/div3d.js


css:
	@lessc src/div3d.less > bin/div3d.css


bundle: copyToBin
	@cat bin/gl-matrix.js >  bin/div3d.bundle.js
	@cat bin/raf.js       >> bin/div3d.bundle.js
	@cat bin/div3d.js     >> bin/div3d.bundle.js


debug: $(CURDIR)/jsdev
	@./jsdev < src/div3d.js > bin/div3d.dbg.js dbg log:console.log


debugBundle: debug
	@cat bin/gl-matrix.js >  bin/div3d.bundle.dbg.js
	@cat bin/raf.js       >> bin/div3d.bundle.dbg.js
	@cat bin/div3d.dbg.js >> bin/div3d.bundle.dbg.js


min: copyToBin
	@uglifyjs bin/gl-matrix.js > bin/gl-matrix.min.js
	@uglifyjs bin/raf.js       > bin/raf.min.js
	@uglifyjs bin/div3d.js     > bin/div3d.min.js


minBundle: bundle
	@uglifyjs bin/div3d.bundle.js > bin/div3d.bundle.min.js


lint: src/div3d.js
	@jshint src/div3d.js samples/*.js


docs:
	@yuidoc -c .yuidoc.json --no-code -T default -q ./src
