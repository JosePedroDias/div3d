/*global DIV3D:false */

var side = 64;
var dims = [side, side, side];
var colors = ['w', 'r', 'g', 'b', 'y', 'o'];

var D = DIV3D;
D.init();

D.setCamera({
    from: [-40, -40, -100]
});

var rubik = D.createGroup('rubik');

var sk = function(/*x, y, z*/) {
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
    o.markup( ['<div class="c ', colors[i], '"></div>'].join('') );
};

var x, y, z, q;
for (z = 0; z < 3; ++z) {
    for (y = 0; y < 3; ++y) {
        for (x = 0; x < 3; ++x) {
            if (x === 1 && y === 1 && z === 1) { continue; }
            q = D.createBox({
                id:         ['q', x, y, z].join('_'),
                parentEl:   'rubik',
                dimensions: dims,
                skips:      sk(x, y, z),
                forEach:    fe
            });

            q.addClass('q');
            q._t([
                side * (x - 1),
                side * (y - 1),
                side * (z - 1)
            ]);
            q._update();
            q._m2 = q._mtxClone();
        }
    }
}

var a = 0;
var vA = Math.PI/4;
var mode = 0;
var r = 100;

D.onFrame(function(t, dt) {
    var x, y, z, o, camPos;

    switch (mode) {
        case 0: // setup dynamic point of view
            camPos = [
                r * Math.cos(a),
                0,
                r * Math.sin(a)
            ];
            D.setCamera({from:camPos});
            break;

        case 1: // rotate whole cube at once
            rubik.rotate(a, [0, 1, 0]);
            break;

        case 2: // rotate a piece
            x = 0, y = 1, z = 2;
            o = D.get(['q', x, y, z].join('_'));
            o.rotate(a, [0, 1, 0]);
            o.translate([
                side * (x - 1),
                side * (y - 1),
                side * (z - 1)
            ]);
            break;

        case 3: // rotate several pieces individually
            for (z = 0; z < 3; ++z) {
                for (y = 0; y < 3; ++y) {
                    for (x = 0; x < 3; ++x) {
                        o = D.get(['q', x, y, z].join('_'));
                        if (!o || y !== 0) { continue; } // y === 0
                        o._clear();
                        o._r(a, [0, 1, 0]);
                        mat4.multiply(o._mtx, o._mtx, o._m2);
                        o._update();
                    }
                }
            }
            break;
    }

    a += vA * dt * 0.001;
});
