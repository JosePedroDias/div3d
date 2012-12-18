all: lint min minBundle debugBundle docs


.PHONY: docs


$(CURDIR)/jsdev.c:
	@wget https://raw.github.com/douglascrockford/JSDev/master/jsdev.c


$(CURDIR)/jsdev: $(CURDIR)/jsdev.c
	@gcc jsdev.c -o jsdev


copyToBin:
	@cp aux/gl-matrix.js bin/gl-matrix.js
	@cp aux/raf.js       bin/raf.js
	@cp src/div3d.js     bin/div3d.js
	@cp src/div3d.css    bin/div3d.css


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
