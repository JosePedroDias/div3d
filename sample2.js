var D = div3d;
//var M = matrix;

var a360 = Math.PI * 2;
var a180 = Math.PI;
var a90  = Math.PI / 2;
var a60  = Math.PI / 3;
var a45  = Math.PI / 4;
var a30  = Math.PI / 6;
var a10  = Math.PI / 18;

var $ = function(a) { return document.querySelector(a); };


var g1E = $('#g1');
var n1E = $('#n1');
var n2E = $('#n2');

var W = window.innerWidth;
var H = window.innerHeight;

var camT = mat4.create();
mat4.identity(camT);
mat4.translate(camT, [W/2, H/2, -400]);
//console.log(camT);
D._applyMatrix(g1E, camT);

var w = 512;
var s = 0.5;
var n1T = mat4.create();
var a = -a90;


var render = function() {
	mat4.identity(n1T);
	mat4.scale(n1T, s, s, s, n1T);
	mat4.rotate(n1T, a, [1, 0, 0], n1T);
	//mat4.translate(n1T, [-w/2, -w/2, 0], n1T);
	//console.log(n1T);
	D._applyMatrix(n1E, n1T);

	a += a10/10;
	if (a > a90) { a -= a180; }

	requestAnimationFrame(render);
};

render();

