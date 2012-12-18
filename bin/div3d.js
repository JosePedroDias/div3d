var div3d = (function() {

    // utility
    var $ = function(a) {
        return (typeof a === 'string') ? document.querySelector(a) : a;
    };

    var rad90 = Math.PI / 2;

    var boxStuff = [
        [ [2, 1], [ 0, -1, 0] ], // -x
        [ [2, 1], [ 0,  1, 0] ], // +x
        [ [0, 2], [-1,  0, 0] ], // -y
        [ [0, 2], [ 1,  0, 0] ], // +y
        [ [0, 1], [ 0,  0, 0] ], // -z
        [ [0, 1], [ 0,  1, 0] ]  // +z
    ];



    var D3D = function(el, mtx) {
        if (!mtx) {
            mtx = mat4.create();
            mat4.identity(mtx);
        }
        this.element = el;
        this.matrix = mtx;
    };

    D3D.prototype = {

        update: function() {
            this.element.style.webkitTransform = ['matrix3d(', mat4.str(this.matrix), ')'].join('');
        },

        resize: function(dims) {
            var el = this.element;
            var s = el.style;
            s.width      =     dims[0]    + 'px';
            s.height     =     dims[1]    + 'px';
            s.marginLeft = ~~(-dims[0]/2) + 'px';
            s.marginTop  = ~~(-dims[1]/2) + 'px';
        },

        addClass: function(clsName) {
            this.element.classList.add(clsName);
        },

        removeClass: function(clsName) {
            this.element.classList.remove(clsName);
        },

        clear: function() {
            mat4.identity(this.matrix);
        },

        translate: function(vec) {
            mat4.translate(this.matrix, vec, this.matrix);
        },

        rotate: function(angle, axis) {
            mat4.rotate(this.matrix, angle, axis, this.matrix);
        },

        scale: function(sx, sy, sz) {
            if (arguments.length === 1) {
                sy = sx;
                sz = sx;
            }
            mat4.scale(this.matrix, [sx, sy, sz], this.matrix);
        },

        opacity: function(n) {
            if      (n < 0) { n = 0; }
            else if (n > 1) { n = 1; }
            this.element.style.opacity = n;
        },

        color: function(c) {
            this.element.style.backgroundColor = c;
        },

        image: function(uri, origin, dims) {
            // TODO
        }

    };

    // the following are assigned to div3d objects as methods


    return {

        _containerDims: [0, 0],
        _lastId: 1,
        _objects: {},
        _startT: undefined,



        init: function() {
            this._startT = new Date().valueOf();

            if (!$('container')) {
                var el = document.createElement('div');
                el.className = 'container';
                document.body.appendChild(el);
            }
            this.importDiv('.container', 'ctn');

            this.createDiv('g0', '#ctn');

            this._onResize();

            window.addEventListener('resize', function() { D._onResize(); });
        },

        time: function(t) {
            if (!t) { t = this.getT(); } // get precision timing if available, else fallback to date diff
            this._dt = t - (this._t || 1/60);
            this._t = t;
            return this._dt;
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
            parentEl = parentEl ? $(parentEl) : $('#g0');    // should be '.container'
            parentEl.appendChild(el);

            return this._finishDiv(el, id);
        },

        importDiv: function(elOrSelector, id) {
            var el = $(elOrSelector);

            if (el.id) {
                id = el.id;
            }
            else {
                if (!id) {
                    id = 'd' + this._lastId++;
                    ++this._lastId;
                }
                el.id = id;
            }

            return this._finishDiv(el, id);
        },

        /**
         * -x, +x. -y, +y, -z, +z
         */
        createBox: function(opts) {
            var dims, f, g = this.createDiv(opts.id, opts.parentEl);
            var a, b;
            /*
                TODO:
                    {String}     parentEl
                    {Number[3]}  dimensions
                    {Boolean[6]} skips
                    {Function}   forEach
            */

            for (var i = 0; i < 6; ++i) {
                if (opts.skips && opts.skips.indexOf(i) !== -1) { continue; }
                f = this.createDiv(undefined, g.element);

                a = boxStuff[i][0];
                b = opts.dimensions;
                dims = [b[a[0]], b[a[1]]];
                f.resize(dims);

                a = [0, 0, 0];
                b = ~~(i/2);
                a[b] = opts.dimensions[b] / (i % 2 ? -2 : 2) * (b === 0 ? -1 : 1);
                f.translate(a);

                /*if (opts.invert) {
                    a = [1, 1, 1];
                    b = ~~(i/2);
                    a[b] = -1;
                    //f.scale(a);
                    mat4.multiplyVec3(f.matrix, a, f.matrix);
                    //console.log(a);
                }*/

                if (i < 6) {
                    f.rotate(rad90 * (i === 5 ? 2 : 1), boxStuff[i][1]);
                }
                if (opts.forEach) {
                    opts.forEach(f, i, dims);
                }

                f.update();
            }
        },

        createCylinder: function(opts) {
            /*
                {Number[2]} dimensions
                {Number}    faces,
                {String}    axis
            */
        },



        _finishDiv: function(el, id) {
            var o = new D3D(el);
            this._objects[id] = o;
            return o;
        },

        _onResize: function() {
            var W = window.innerWidth;
            var H = window.innerHeight;
            this._containerDims = [W, H];

            var o = this.get('g0');
            o.clear();
            o.translate([W/2, H/2, 0]);
            o.update();
        }

    };

})();
