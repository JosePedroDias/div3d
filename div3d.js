var div3d = (function() {

    return {

        _applyMatrix: function(el, mtx) {
        	mtx = mat4.str(mtx);
        	//console.log(mtx);
            el.style.webkitTransform = ['matrix3d(', mtx, ')'].join('');
        }

    };

})();
