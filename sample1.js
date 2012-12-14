var D = div3d;

// some common angles in radians
var a360 = Math.PI * 2;
var a180 = Math.PI;
var  a90 = Math.PI / 2;
var  a60 = Math.PI / 3;
var  a45 = Math.PI / 4;
var  a30 = Math.PI / 6;
var  a10 = Math.PI / 18;
var  a1  = Math.PI / 180;

D.init();

D.importDiv('#n1');
D.sizeDiv('n1', [256, 256]);

D.importDiv('#n2');
D.sizeDiv('n2', [256, 256]); 

var a = -a90;



var render = function() {
	var o, m;

	o = D.get('n1');
	m = o.matrix;
	mat4.identity(m);
	mat4.rotate(m, a, [1, 0, 0], m);
	mat4.translate(m, [0, 0, 128], m);
	o.update();

	o = D.get('n2');
	m = o.matrix;
	mat4.identity(m);
	mat4.rotate(m, a+a90, [1, 0, 0], m);
	mat4.translate(m, [0, 0, 128], m);
	o.update();

	a += a1;
	if (a > a90) { a -= a180; }

	requestAnimationFrame(render);
};

render();
