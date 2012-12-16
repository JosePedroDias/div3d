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



var o, m, i;

var sz = [256, 256];

o = D.createDiv('cube');

for (i = 1; i <=4; ++i) {
    o = D.createDiv('f' + i, '#cube');
    o.resize(sz);
    o.element.innerHTML = i;
    o.element.classList.add('cubeFace');

    m = o.matrix;
    mat4.rotate(m, -a90*i, [1, 0, 0], m);
    mat4.translate(m, [0, 0, 128], m);
    o.update();
}

o = D.createDiv('orbit');
o.update();

for (i = 1; i <= 6; ++i) {
    o = D.createDiv(undefined, '#orbit');
    o.element.classList.add('title');
    o.resize([400, 100]);
    o.element.innerHTML = 'DIV3D';
    o.element.style.webkitBackfaceVisibility = 'visible';
    m = o.matrix;
    mat4.rotate(m, a60*i, [0, 1, 0], m);
    mat4.translate(m, [0, 0, 240], m);
    o.update();
}


var a  = 0;    // current angle
var vA = a45;  // angle change per second
var prevT = 0;



var render = function(t) {
    if (!t) { t = D.getT(); } // get precision timing if available, else fallback to date diff
    var dt = t - prevT;
    prevT = t;

	var o, m;

    o = D.get('cube');
    m = o.matrix;
    mat4.identity(m);
    //mat4.translate(m, [0, 0, -50], m);
    mat4.rotate(m, a, [1, 0, 0], m);
    o.update();

    o = D.get('orbit');
    m = o.matrix;
    mat4.identity(m);

    mat4.rotate(m, a, [0, 1, 0], m);
    //mat4.translate(m, [0, 0, 150], m);
    o.update();

	a += vA * dt * 0.001;

	requestAnimationFrame(render);
};

render();
