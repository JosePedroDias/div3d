/*global DIV3D:false, requestAnimationFrame:false */

var D = DIV3D;

// some common angles in radians
var  a90 = Math.PI / 2;
var  a60 = Math.PI / 3;
var  a45 = Math.PI / 4;



D.init();



var o, i;

var sz = [256, 256];

o = D.createDiv('cube');

for (i = 1; i <=4; ++i) {
    o = D.createDiv('f' + i, '#cube');
    o.addClass('interactive');
    o.resize(sz);
    o.element.innerHTML = i;
    o.element.classList.add('cubeFace');
    o.rotate(-a90*i, [1, 0, 0]);
    o.translate([0, 0, 128]);
    o.update();
}

o = D.createDiv('orbit');
o.update();

for (i = 1; i <= 6; ++i) {
    o = D.createDiv(undefined, '#orbit');
    o.addClass('title');
    o.addClass('doubleSided');
    o.resize([400, 100]);
    o.element.innerHTML = 'DIV3D';

    o.rotate(a60*i, [0, 1, 0]);
    o.translate([0, 0, 240]);
    o.update();
}

/*document.body.addEventListener('click', function(ev) {
    var el = ev.target;
    console.log(el);
    while (!el.id) { el = el.parent; }
    console.log(el.id);
});*/

var a  = 0;    // current angle
var vA = a45;  // angle change per second



var render = function(t) {
    var dt = D.time(t);

	var o;

    o = D.get('cube');
    o.clear();
    o.rotate(a, [1, 0, 0]);
    o.update();

    o = D.get('orbit');
    o.clear();
    o.rotate(a, [0, 1, 0]);
    o.update();

	a += vA * dt * 0.001;

	requestAnimationFrame(render);
};

render();
