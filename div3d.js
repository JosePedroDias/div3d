var div3d = (function() {

    var $ = function(a) {
        return (typeof a === 'string') ? document.querySelector(a) : a;
    };

    var update = function() {
        D._updateMatrix(this);
    };

    var resize = function(dims) {
        var el = this.element;
        var s = el.style;
        s.width      =     dims[0]    + 'px';
        s.height     =     dims[1]    + 'px';
        s.marginLeft = ~~(-dims[0]/2) + 'px';
        s.marginTop  = ~~(-dims[1]/2) + 'px';
    };

    return {

        _containerDims: [0, 0],

        _lastId: 1,

        _objects: {},

        _startT: undefined,

        init: function() {
            this._startT = new Date().valueOf();

            this.importDiv('.container', 'ctn');

            this.importDiv('#g1');

            this._onResize();

            window.addEventListener('resize', function() { D._onResize(); });
        },

        get: function(id) {
            return this._objects[id];
        },

        getT: function() {
            return new Date().valueOf() - this._startT;
        },

        createDiv: function(id, parentEl) {
            var el = document.createElement('div');
            el.className = 'node';
            if (!id) {
                id = 'd' + this._lastId++;
            }
            el.id = id;
            parentEl = parentEl ? $(parentEl) : this._containerEl;
            parentEl.appendChild(el);

            return this._finishDiv(el, id);
        },

        importDiv: function(elOrSelector, id) {
            var el = $(elOrSelector);
            var id = el.id || id;
            if (!id) {
                id = 'd' + this._lastId++;
                ++this._lastId;
                el.id = id;
            }

            return this._finishDiv(el, id);
        },

        _finishDiv: function(el, id) {
            var mtx = mat4.create();
            mat4.identity(mtx);

            var o = {
                element:  el,
                matrices: [],
                matrix:   mtx,
                resize:   resize,
                update:   update
            };

            this._objects[id] = o;

            return o;
        },

        _onResize: function() {
            var W = window.innerWidth;
            var H = window.innerHeight;
            this._containerDims = [W, H];

            var o = this.get('g1');
            var m = o.matrix;

            mat4.identity(m);
            mat4.translate(m, [W/2, H/2, 0]);
            this._updateMatrix(o);
        },

        _updateMatrix: function(o) {
            this._applyMatrix(o.element, o.matrix);
        },

        _applyMatrix: function(el, mtx) {
            mtx = mat4.str(mtx);
            el.style.webkitTransform = ['matrix3d(', mtx, ')'].join('');
        }

    };

})();
