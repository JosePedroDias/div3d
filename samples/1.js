/*global DIV3D:false */

var D = DIV3D;

D.init();

var o, i, sz = [256, 256];

D.createGroup('cube');

for (i = 1; i <=4; ++i) {
    o = D.createRect({
        id:       'f' + i,
        parentEl: 'cube',
        size:     sz
    });
    o.markup(i);
    o.rotate(-Math.PI/2*i, [1, 0, 0]);
    o.translate([0, 0, 128]);
}

var a  = 0;    // current angle
var vA = Math.PI / 4;  // angle change per second

D.onFrame(function(t, dt) {
	var o = D.get('cube');
    o.translate([0, 0, -50]);
    o.rotate(a, [1, 0, 0]);

	a += vA * dt * 0.001;
});
