/*global DIV3D:false, requestAnimationFrame:false */

var side = 64;
var dims = [side, side, side];
var colors = ['w', 'r', 'g', 'b', 'y', 'o'];

var D = DIV3D;
D.init();

var rubik = D.createDiv('rubik');
rubik.lookAt([-40, -40, -100]);//, [0, 100, 0], [0, 1, 0]);
rubik.update();

var x, y, z, q;

var sk = function(x, y, z) {
    var r = [];//TODO

    /*if (x !== 0) { r.push(0); }
    if (x !== 2) { r.push(1); }
    if (y !== 0) { r.push(2); }
    if (y !== 2) { r.push(3); }
    if (z !== 0) { r.push(4); }
    if (z !== 2) { r.push(5); }

    console.log([x,y,z], r);*/
    return r;
};

var fe = function(o, i) {
    o.addClass('blk');
    o.element.innerHTML = ['<div class="c ', colors[i], '"></div>'].join('');
};

for (z = 0; z < 3; ++z) {
    for (y = 0; y < 3; ++y) {
        for (x = 0; x < 3; ++x) {
            if (x === 1 && y === 1 && z === 1) { continue; }
            q = D.createBox({
                id:         ['q', x, y, z].join('_'),
                parentEl:   rubik.element,
                //parentEl:   '#rubik',
                skips:      sk(x, y, z),
                dimensions: dims,
                forEach:    fe
            });

            q.addClass('q');
            q.translate([
                side * (x - 1),
                side * (y - 1),
                side * (z - 1)
            ]);
            q.update();
            q.m2 = q.clone();
        }
    }
}

var a = 0;
var vA = Math.PI/4;




var render = function(t) {
    var dt = D.time(t);

    // setup dynamic point of view
    /*var o = rubik;
    o.lookAt([
        100 * Math.cos(a),
        0,
        100 * Math.sin(a)
    ]);
    o.update();*/

    // rotate whole cube at once
	/*var o = rubik;
    o.clear();
    o.rotate(a, [0, 1, 0], a);
    o.update();*/

    // rotate a piece
    /*var x = 0, y = 1, z = 2;
    var o = D.get(['q', x, y, z].join('_'));
    o.clear();
    o.rotate(a, [0, 1, 0], a);
    o.translate([
        side * (x - 1),
        side * (y - 1),
        side * (z - 1)
    ]);
    o.update();*/

    // rotate several pieces individually
    var x, y, z, o;
    for (z = 0; z < 3; ++z) {
        for (y = 0; y < 3; ++y) {
            for (x = 0; x < 3; ++x) {
                o = D.get(['q', x, y, z].join('_'));
                if (!o || y !== 0) { continue; } // y === 0
                o.clear();
                o.rotate(a, [0, 1, 0]);
                mat4.multiply(o.matrix, o.matrix, o.m2);
                o.update();
            }
        }
    }

	a += vA * dt * 0.001;

	requestAnimationFrame(render);
};

render();
