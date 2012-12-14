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

/*D.importDiv('#n1');
D.sizeDiv('n1', [256, 256]);

D.importDiv('#n2');
D.sizeDiv('n2', [256, 256]);*/

var o;

var sz = [256, 256];

o = D.createDiv('n1', '#g1');
o.resize(sz);
o.element.innerHTML = '1';

o = D.createDiv('n2', '#g1');
o.resize(sz);
o.element.innerHTML = '2';

o = D.createDiv('n3', '#g1');
o.resize(sz);
o.element.innerHTML = '3';

o = D.createDiv('n4', '#g1');
o.resize(sz);
o.element.innerHTML = '4';

var a  = 0;    // current angle
var vA = a45;  // angle change per second
var oldT = 0;


var render = function(t) {
    if (!t) { t = D.getT(); } // get precision timing if available, else fallback to date diff
    var dt = t - oldT;
    oldT = t;

    //console.log(dt);

	var o, m;

    for (var i = 1; i <=4; ++i) {
        o = D.get('n' + i);
        m = o.matrix;
        mat4.identity(m);
        mat4.rotate(m, a - a90*i, [1, 0, 0], m);
        mat4.translate(m, [0, 0, 128], m);
        o.update();
    }

	a += vA * dt * 0.001;

	requestAnimationFrame(render);
};

render();
