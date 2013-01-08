/*global DIV3D:false */

var D = DIV3D;

// some common angles in radians
var  a90 = Math.PI / 2;
var  a60 = Math.PI / 3;
var  a45 = Math.PI / 4;

D.init();

var o, i;

var sz = [256, 256];

D.createGroup('cube');

for (i = 1; i <= 4; ++i) {
    o = D.createRect({
        id:       'f' + i,
        parent:   'cube',
        classes:  'interactive cubeFace',
        size:     sz,
        markup:   i
    });
    o.rotate(-a90*i, [1, 0, 0]);
    o.translate([0, 0, 128]);
}

D.createGroup('orbit');

for (i = 1; i <= 6; ++i) {
    o = D.createRect({
        parent:   'orbit',
        classes:  'title doubleSided',
        size:     [400, 100],
        markup:   'DIV3D'
    });
    o.rotate(a60*i, [0, 1, 0]);
    o.translate([0, 0, 240]);
}

/*document.body.addEventListener('click', function(ev) {
    var el = ev.target;
    console.log(el);
    while (!el.id) { el = el.parent; }
    console.log(el.id);
});*/

var a  = 0;    // current angle
var vA = a45;  // angle change per second

D.onFrame(function(t, dt) {
	var o;

    o = D.get('cube');
    o.rotate(a, [1, 0, 0]);

    o = D.get('orbit');
    o.rotate(a, [0, 1, 0]);

	a += vA * dt * 0.001;
});
