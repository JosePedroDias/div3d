/*global DIV3D:false, requestAnimationFrame:false */

var D = DIV3D;

// some common angles in radians
var  a90 = Math.PI / 2;
var  a45 = Math.PI / 4;



D.init();



var o, i;

var sz = [256, 256];

o = D.createDiv('cube');

for (i = 1; i <=4; ++i) {
    o = D.createDiv('f' + i, '#cube');
    o.resize(sz);
    o.element.innerHTML = i;
    o.clear();
    o.rotate(-a90*i, [1, 0, 0]);
    o.translate([0, 0, 128]);
    o.update();
}



var a  = 0;    // current angle
var vA = a45;  // angle change per second



var render = function(t) {
    var dt = D.time(t);

	var o;
    o = D.get('cube');
    o.clear();
    o.translate([0, 0, -50]);
    o.rotate(a, [1, 0, 0]);
    o.update();

	a += vA * dt * 0.001;

	requestAnimationFrame(render);
};

render();
