# Motivation

my take on famo.us-like experiments, that is, CSS3 transforms



# URIs

* [source code on github](http://github.com/josepedrodias/div3d)

* [samples](http://josepedrodias.github.com/div3d/index.html)

* [documentation](http://josepedrodias.github.com/div3d/docs/)

* [TODO](https://github.com/JosePedroDias/div3d/blob/master/TODO.md)



# Usage Requirements

1. a decent browser with 3D acceleration (google chrome / safari)



# Development Requirements

1. workflow is orchestrated with Makefile (wow!)

```
sudo apt-get install cmake
```


1. Code is minified with uglify

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



1. Debug version is generated with Douglas Crockford's jsdev tool

If you have the proper tools (wget and gcc) the makefile should fetch and compile jsdev for you :)
