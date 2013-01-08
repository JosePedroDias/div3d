/*global DIV3D:false */

var D = DIV3D;

D.init();

//var A = ['-x', '+x', '-y', '+y', '-z', '+z'];
var A = ['esq', 'dir', 'bai', 'cim', 'fre', 'trá'];

var cube = D.createBox({
    //invert:      true,
    dimensions: [96, 96, 96],
    forEach: function(o, i) {
        o.addClass('round f' + (i+1));
        o.markup( A[i] );
        o.centerText();
    }
});

var a = 0;
var vA = Math.PI / 4;

D.onFrame(function(t, dt) {
    cube.rotate(a, [0.33, 0.66, 0]);

    a += vA * dt * 0.001;
});
