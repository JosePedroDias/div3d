/*global DIV3D:false, requestAnimationFrame:false */

var D = DIV3D;



D.init();

//var A = ['-x', '+x', '-y', '+y', '-z', '+z'];
var A = ['esq', 'dir', 'bai', 'cim', 'fre', 'trá'];

D.createBox({
    skips:       [],
    invert:      true,
    id:         'cube',
    dimensions: [96, 128, 128],
    forEach: function(o, i) {
        o.addClass('face');
        o.addClass('f' + (i+1));
        o.element.innerHTML = A[i];
    }
});

var a = 0;
var vA = Math.PI/4;




var render = function(t) {
    var dt = D.time(t);

	var o;
    o = D.get('cube');
    o.clear();
    o.rotate(a, [0.33, 0.66, 0]);
    o.update();

	a += vA * dt * 0.001;

	requestAnimationFrame(render);
};

render();
