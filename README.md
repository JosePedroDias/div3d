# Motivation

My take on [famo.us](http://famo.us)-like experiments.

It offers [an API](http://josepedrodias.github.com/div3d/docs/) for generation, positioning and animation of div elements in 3D space.
They get positioned and animated via CSS3 matrix3d transforms,
which are calculated by your browser's JavaScript engine with the aid of the excellent [gl-matrix](https://github.com/toji/gl-matrix) library.
No CSS transitions are used - animations are performed in JavaScript too.

The purpose of the project is to allow the creation of 3D experiences in desktop and mobile browsers.
Notice that you're limited in the geometry that can be presented - there are:

* 3D transformed divs (which may receive regular HTML layout such as paragraphs, images, forms, and other HTML elements)
* axis-aligned divs (such as trees, human figures)
* camera-algined divs (such as lens flares and other common special effects)

In time, helper abstractions will be offered to model common cases (ex: a box).


# URIs for the impatient

* [samples](http://josepedrodias.github.com/div3d/index.html)

* [documentation](http://josepedrodias.github.com/div3d/docs/)

* [source code on github](http://github.com/josepedrodias/div3d)

* [TODO](https://github.com/JosePedroDias/div3d/blob/master/TODO.md)



# Usage Requirements

1. a decent browser with 3D acceleration (google chrome / safari)



# Development Requirements

1. workflow is orchestrated with Makefile (wow!)

```
sudo apt-get install cmake
```

1. CSS is generated from LESS using lessc

```
sudo npm install -g less
```

1. Code is minified with uglifyjs

```
sudo npm install -g uglify-js
```

1. Code is validated with jshint

```
sudo npm install -g jshint
```

1. Documentation is generated with yuidoc

```
npm -g install yuidocjs
```

1. Debug version is generated with Douglas Crockford's [jsdev tool](https://github.com/douglascrockford/JSDev)

If you have the proper tools (wget|curl and gcc) the makefile should fetch and compile jsdev for you :)



# Current state

Works well on Google Chromes and mobile Chrome for Android 4.x.
In time, with the maturity of the library, we'll support officially other browsers.



# Introduction

There are 3 flavours:

* [div3d.bundle.min.js](http://josepedrodias.github.com/div3d/bin/div3d.bundle.min.js) - minified source
* [div3d.bundle.js](http://josepedrodias.github.com/div3d/bin/div3d.bundle.js)         - regular source
* [div3d.bundle.dbg.js](http://josepedrodias.github.com/div3d/bin/div3d.bundle.dbg.js) - source which additional checks for API arguments and the like

You should start by using the debug bundle. Switch to the min bundle at production time.

Don't forget to add the [div3d.css](http://josepedrodias.github.com/div3d/bin/div3d.css) file too!

Take a peek at the [samples](http://josepedrodias.github.com/div3d/index.html) and make use of the [API documentation](http://josepedrodias.github.com/div3d/docs/).
