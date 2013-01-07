/*global DIV3D:false */

var D = DIV3D;
D.init();

D.setCamera({
    from: [0, 0, 0],
    to:   [0, 0, 10]
});

D.setCubeMap({
    size:      1024,
    image:     'resources/cubemap1_4.jpg'
});


var a = 0;
var vA = Math.PI/4;

D.onFrame(function(t, dt) {
    var r = 1000;
    D.setCamera({
        to: [
                r * Math.cos(a),
                0,
                r * Math.sin(a)
            ]
    });

    a += vA * dt * 0.001;
});
