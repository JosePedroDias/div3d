/*global DIV3D:false, requestAnimationFrame:false */

var D = DIV3D;



D.init();


var o = D.createDiv('origin');
o.lookAt(
    [-10, -40, 100],
    [0, 60, 0],
    [0, 1, 0]
);
o.update();


var o = D.createDiv('field', '#origin');
o.resize([715, 464]);
o.rotate(Math.PI/2, [1, 0, 0]);
o.update();
o.color('#0A0');


o = D.createDiv('player', '#origin');
//o.resize([185, 223]);//, ['50%', '100%']);

var v = [~~(185*0.2), ~~(223*0.2)];
o.resize(v);
o.element.style.backgroundSize = [v[0], 'px ', v[1], 'px'].join('');
o.addClass('doubleSided');
o.translate([0, -v[1]/2, 0]);
o.update();

var a = 0;
var vA = Math.PI/4;



var render = function(t) {
    var dt = D.time(t);

	var o = D.get('origin');
    o.lookAt([
        150 * Math.cos(a),
        -70,
        150 * Math.sin(a)
    ]);
    o.update();

	a += vA * dt * 0.001;

	requestAnimationFrame(render);
};

render();
