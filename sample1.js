var D = div3d;
var M = matrix;
var a360 = Math.PI * 2;
var a180 = Math.PI;
var a90  = Math.PI / 2;
var a60  = Math.PI / 3;
var a45  = Math.PI / 4;
var a30  = Math.PI / 6;
var a10  = Math.PI / 18;

var $ = function(a) { return document.querySelector(a); };

var g1El = $('#g1');
var s1El = $('#s1');

var W = window.innerWidth;
var H = window.innerHeight;

var camT = M.translate(W/2, H/2, 0);

var w = 512;
var s = 0.5;
var s1T = M.scale(s, s, s);
s1T = M.m( s1T , M.translate(-w/2, -w/2, 0) );  // THIS HACK IS INCORRECT
s1T = M.m( s1T, M.rotateX(a30) );


D._applyMatrix(g1El, camT);
D._applyMatrix(s1El, s1T);
