/*global DIV3D:false, requestAnimationFrame:false */

var D = DIV3D;



D.init();


var o = D.createDiv('field');
o.resize([715, 464]);
o.color('#0A0');

//o.translate([0, 0, -100]);
o.rotate(Math.PI/2, [1, 0, 0]);
o.translate([0, 0, -100]);

//o.scale(0.5);
o.update();

o = D.createDiv('player');
o.resize([185, 223]);//, ['50%', '100%']);
//o.color('blue');

o.scale(0.2);
o.update();


var render = function() {
/*    var dt = D.time(t);

	var o;
    o = D.get('cube');
    o.clear();
    o.rotate(a, [0.33, 0.66, 0]);
    o.update();

	a += vA * dt * 0.001;*/

	requestAnimationFrame(render);
};

render();
