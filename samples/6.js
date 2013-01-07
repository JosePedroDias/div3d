/*global DIV3D:false, requestAnimationFrame:false */

var D = DIV3D;
D.init();

var o;



var o = D.createDiv('origin');
o.lookAt([50, 30, 140]);
o.update();



D.createDiv('axes', 'origin');



o = D.createDiv('ax', 'axes');
o.resize([256, 4], [1, 0.5]);
o.addClass('doubleSided');

o = D.createDiv('lx', 'axes');
o.resize([32, 32]);
o.addClass('doubleSided');
o.element.innerHTML = 'X';



o = D.createDiv('ay', 'axes');
o.resize([4, 256], [0.5, 0]);
o.addClass('doubleSided');

o = D.createDiv('ly', 'axes');
o.resize([32, 32]);
o.addClass('doubleSided');
o.element.innerHTML = 'Y';



o = D.createDiv('az', 'axes');
o.resize([256, 4], [1, 0.5]);
o.addClass('doubleSided');
o.rotate(Math.PI/2, [0, 1, 0]);
o.update();

o = D.createDiv('lz', 'axes');
o.resize([32, 32]);
o.addClass('doubleSided');
o.element.innerHTML = 'Z';



var a = 0;
var vA = Math.PI/4;



var render = function(t) {
    var dt = D.time(t);

    o = D.get('lx');
    o.billboard([256, 0, 0]);

    o = D.get('ly');
    o.billboard([0, -256, 0]);

    o = D.get('lz');
    o.billboard([0, 0, 256]);

	a += vA * dt * 0.001;

	requestAnimationFrame(render);
};

render();
