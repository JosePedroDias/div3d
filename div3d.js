var div3d = (function() {

    return {

        _applyMatrix: function(el, mtx) {
            el.style.webkitTransform = ['matrix3d(', mtx, ')'].join('');
        }

    };

})();
