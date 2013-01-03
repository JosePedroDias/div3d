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

var positions = new Array(players.length);

var i, f, plr, pos;
for (i = 0, f = players.length; i < f; ++i) {
    plr = players[i];
    v = [~~(w*s), ~~(h*s)];

    o = D.createDiv('player_' + i, '#origin');

    pos = [w*plr[0], -v[1]/2, h*plr[1]];
    o.resize(v);
    o.element.style.backgroundSize = [v[0], 'px ', v[1], 'px'].join('');
    o.addClass('player');
    o.addClass('doubleSided');
    positions[i] = pos;
}



var a = 0;
var vA = Math.PI/4;
var camPos = vec3.create();



var render = function(t) {
    var dt = D.time(t);


	var o = D.get('origin');
    vec3.copy(camPos, [
        150 * Math.cos(a),
        -70,
        150 * Math.sin(a)
    ]);
    o.lookAt(camPos);
    o.update();


    for (i = 0; i < f; ++i) {
        o = D.get('player_' + i);
        o.billboard(positions[i]);
        //o.billboardAxisAligned(positions[i], camPos, 1); // TODO not working yet!
    }


	a += vA * dt * 0.001;

	requestAnimationFrame(render);
};

render();
