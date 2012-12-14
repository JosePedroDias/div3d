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
var s2El = $('#s2');

var W = window.innerWidth;
var H = window.innerHeight;

var camT = M.translate(W/2, H/2, 0);

var w = 512;
var s = 0.5;
var s1T, s2T;

D._applyMatrix(g1El, camT);


var a = -a90;

var render = function() {
	s1T = M.scale(s, s, s);
	s1T = M.m( s1T, M.rotateX(a) );
	s1T = M.m( s1T , M.translate(-w/2, -w/2, 0) );  // THIS HACK IS INCORRECT
	D._applyMatrix(s1El, s1T);

	s2T = M.scale(s, s, s);
	s2T = M.m( s2T, M.rotateX(a) );
	s2T = M.m( s2T , M.translate(-w/2, -w/2, 100) );  // THIS HACK IS INCORRECT
	D._applyMatrix(s2El, s2T);


	a += a10/10;
	if (a > a90) { a -= a180; }

	requestAnimationFrame(render);
};

//setInterval(render, 10);
render();

