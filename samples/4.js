/*global DIV3D:false */

var D = DIV3D;

D.init();

D.setCamera({
    from: [-10, -40, 100],
    to:   [0, 0, 0]
});

var o = D.createRect({
    id:    'field',
    size:  [715, 464]
});
o.rotate(Math.PI/2, [1, 0, 0]);

var w = 185;
var h = 223;
var s = 0.2;

var v = [~~(w*s), ~~(h*s)];

var players = [
    [1.8, 0],

    [1.0, -0.7],
    [1.0,  0.7],
    [1.0, -0.3],
    [1.0,  0.3],

    [-0.2, -0.8],
    [-0.2,  0.8],
    [-0.2, -0.3],
    [-0.2,  0.3],

    [-1.2, -0.4],
    [-1.2,  0.4]
];

var i, f, plr;
for (i = 0, f = players.length; i < f; ++i) {
    plr = players[i];
    v = [~~(w*s), ~~(h*s)];

    o = D.createBillboard({
    //o = D.createRect({
        id:       'player_' + i,
        position: [w*plr[0], -v[1]/2, h*plr[1]],
        size:     v,
        classes:  'player doubleSided'
    });
    //o.translate([w*plr[0], -v[1]/2, h*plr[1]]);

    o._el.style.backgroundSize = [v[0], 'px ', v[1], 'px'].join('');
}

var a = 0;
var vA = Math.PI/4;

D.onFrame(function(t, dt) {
    D.setCamera({
        from: [
            150 * Math.cos(a),
            -70,
            150 * Math.sin(a)
        ]
    });

    a += vA * dt * 0.001;
});
