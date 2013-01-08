/*global DIV3D:false */

var D = DIV3D;
D.init();

D.setCamera({
    from: [50, 30, 140]
});

var o;

D.createGroup('axes');

o = D._createDiv('ax', 'axes');
o.resize([256, 4], [1, 0.5]);
o.addClass('doubleSided');

o = D._createDiv('lx', 'axes');
o.resize([32, 32]);
o.addClass('doubleSided');
o.markup('X');

o = D._createDiv('ay', 'axes');
o.resize([4, 256], [0.5, 0]);
o.addClass('doubleSided');

o = D._createDiv('ly', 'axes');
o.resize([32, 32]);
o.addClass('doubleSided');
o.markup('Y');

o = D._createDiv('az', 'axes');
o.resize([256, 4], [1, 0.5]);
o.addClass('doubleSided');
o.rotate(Math.PI/2, [0, 1, 0]);

o = D._createDiv('lz', 'axes');
o.resize([32, 32]);
o.addClass('doubleSided');
o.markup('Z');

var a = 0;
var vA = Math.PI/4;

D.onFrame(function(t, dt) {
    /*o = D.get('lx');
    o.billboard([256, 0, 0]);

    o = D.get('ly');
    o.billboard([0, -256, 0]);

    o = D.get('lz');
    o.billboard([0, 0, 256]);*/

	a += vA * dt * 0.001;
});
