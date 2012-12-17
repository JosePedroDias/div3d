all:	doc min

min:
	cp src/div3d.js bin/div3d.js
	cp src/div3d.css bin/div3d.css
	uglifyjs bin/div3d.js > bin/div3d.min.js

doc:
	pandoc -toc -s API.md -o API.html -t html5 -c md.css
	pandoc -toc -s TODO.md -o TODO.html -t html5 -c md.css
