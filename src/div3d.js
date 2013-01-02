/*jshint debug:true */
/*global DIV3D:true */

/**
 * @module div3d
 * @main   div3d
 */



(function() {

    // internal stuff, not exposed

    /*dbg
     var assertNumber = function(n, m) { if (typeof n !== 'number') { throw m || 'must be number('+n+')'; } };
     var assertBetween = function(n, a, b, m) { if (n < a || b > b) { throw m || 'must be between '+a+' and '+b+' ('+n+')'; } };
     var assertString = function(s, m) { if (typeof s !== 'string') { throw m || 'must be string('+s+')'; } };
     var assertVecN = function(v, n, m) { if ((!v instanceof Array) || (v.length !== n)) { throw m || 'must be array of size '+n+' ('+v+')'; } };
     */

    // utility method to resolve CSS selectors
    var $ = function(a) {
        return (typeof a === 'string') ? document.querySelector(a) : a;
    };

    // 90 degrees in radians
    var rad90 = Math.PI / 2;

    // auxiliary stuff for the DIV3D.createBox() method
    var boxStuff = [
        [ [2, 1], [ 0, -1, 0] ], // -x
        [ [2, 1], [ 0,  1, 0] ], // +x
        [ [0, 2], [-1,  0, 0] ], // -y
        [ [0, 2], [ 1,  0, 0] ], // +y
        [ [0, 1], [ 0,  0, 0] ], // -z
        [ [0, 1], [ 0,  1, 0] ]  // +z
    ];



    /**
     * The D3D class exposes an API to manipulate div3d quads (divs).
     * This constructor isn't expected to be called by the end client.
     * Use DIV3D.createDiv() and DIV3D.importDiv() instead.
     *
     * @class D3D
     * @constructor
     * @param {DomElement}  el   the DOM element to assign to the object
     * @param {mat4}        mtx  the transformation matrix to assign to the object
     *
     * @see DIV3D.createDiv
     * @see DIV3D.importDiv
     */
    var D3D = function(el, mtx) {
        if (!mtx) {
            mtx = mat4.create(1);
            mat4.identity(mtx);
        }
        this.element = el;
        this.matrix = mtx;
    };

    D3D.prototype = {

        /**
         * call this method once you're done with updating transformations.
         *
         * @method update
         */
        update: function() {
            this.element.style.webkitTransform = ['matrix3d(', mat4.str(this.matrix), ')'].join('');
        },

        /**
         * sets the div dimensions. the divs keeps centered over its pivot point.
         *
         * @method resize
         * @param {Number[2]}  dims   is an array of integers (width and height)
         */
        resize: function(dims, center) {
            /*dbg
            assertVecN(dims, 2, '1st argument must be a vector of 2 numbers');
            if (center !== undefined) {
                assertVecN(center, 2, '2nd argument must be a vector of 2 numbers/percentages');
            }
            */


            this.size = dims;
            var cir = [false, false];   // centerIsRatio
            var i, d, ci;

            if (!center) {
                center = [0.5, 0.5];
                cir = [true, true];
            }
            else {
                for (i = 0; i < 2; ++i) {
                    ci = center[i];
                    if (typeof ci === 'string' && ci.indexOf('%') !== -1) {
                        ci = parseFloat(ci) * 0.01;
                        cir[i] = true;
                    }
                }
            }

            for (i = 0; i < 2; ++i) {
                ci = center[i];
                d = dims[i];

                center[i] = Math.round( -d + ci * (cir[i] ? d : 1) );
            }

            var el = this.element;
            var s = el.style;
            s.width      =   dims[0] + 'px';
            s.height     =   dims[1] + 'px';
            s.marginLeft = center[0] + 'px';
            s.marginTop  = center[1] + 'px';
        },

        /**
         * adds a CSS class to the object's element.
         *
         * @method addClass
         * @param {String} clsName
         */
        addClass: function(clsName) {
            /*dbg assertString(clsName, '1st argument must be a string');*/
            this.element.classList.add(clsName);
        },

        /**
         * removes a CSS class from the object's element.
         *
         * @method removeClass
         * @param {String} clsName
         */
        removeClass: function(clsName) {
            /*dbg assertString(clsName, '1st argument must be a string');*/
            this.element.classList.remove(clsName);
        },

        /**
         * clears transformation matrix (sets it to the identity matrix).
         * use this prior to assigning a new set of matrices to transform an object.
         *
         * @method clear
         */
        clear: function() {
            mat4.identity(this.matrix);
        },

        /**
         * translates to object.
         *
         * @method translate
         * @param {Number[3]}  vec  is a 3 numbers array (dx, dy, dz)
         */
        translate: function(vec) {
            /*dbg assertVecN(vec, 3, '1st argument must be a Number[3]');*/
            mat4.translate(this.matrix, this.matrix, vec);
        },

        /**
         * rotates the object.
         *
         * @method rotate
         * @param {Number}     angle  the angle to rotate around the axis, in radians
         * @param {Number[3]}  axis   is a 3D versor, that is, a 3 dimensions vector with norm 1
         */
        rotate: function(angle, axis) {
            /*dbg assertNumber(angle, '1st argument must be a Number');*/
            /*dbg assertVecN(axis, 3, '2nd argument must be a Number[3]');*/
            mat4.rotate(this.matrix, this.matrix, angle, axis);
        },

        /**
         * scales the object.
         *
         * @method scale
         * @param {Number|Number[3]}  s  can either be a number (for proportional scale) or a 3 dimensions vector
         */
        scale: function(s) {
            if (typeof s === 'number') {
                s = [s, s, s];
            }
            /*dbg assertVecN(s, 3, '1st argument must be a Number or Number[3]');*/
            mat4.scale(this.matrix, this.matrix, s);
        },

        clone: function() {
            return mat4.clone(this.matrix);
        },

        /**
         * sets the object's opacity.
         *
         * @method opacity
         * @param {Number}  n  a float ranging from 0 to 1
         */
        opacity: function(n) {
            /*dbg assertBetween(n, 0, 1, '1st argument must be a number between 0 and 1');*/
            this.element.style.opacity = n;
        },

        /**
         * sets the object's color.
         *
         * @method color
         * @param {String}  c   can be any supported CSS color
         */
        color: function(c) {
            this.element.style.backgroundColor = c;
        },

        centerText: function() {
            var s = this.element.style;
            s.textAlign = 'center';
            s.lineHeight = this.size[1] + 'px';
        },

        round: function() {
            var s = this.element.style;
            s.borderRadius = '50%';
        }

        // TODO
        //image: function(uri, origin, dims) {
        //}

    };



    /**
     * DIV3D public interface
     *
     * @class DIV3D
     * @static
     */
    DIV3D = {

        _containerDims: [0, 0],
        _lastId: 1,
        _objects: {},
        _startT: undefined,


        /**
         * should be called once at the start
         *
         * @method init
         */
        init: function() {
            /*log 'DIV3D.init() called'*/

            this._startT = new Date().valueOf();

            if (!$('container')) {
                var el = document.createElement('div');
                el.className = 'container';
                document.body.appendChild(el);
            }
            this.importDiv('.container', 'ctn');

            this.createDiv('g0', '#ctn');

            this._onResize();

            window.addEventListener('resize', function() { DIV3D._onResize(); });
        },

        /**
         * should be called at the beginning of the requestAnimationFrame callback, passing it its first argument.
         * the API exposes DIV3D._t and DIV3D._dt
         *
         * @method time
         * @param {Number} t
         * @return {Number} dt
         *
         * @see DIV3D._t
         * @see DIV3D._dt
         */
        time: function(t) {
            if (!t) { t = new Date().valueOf() - this._startT; } // get precision timing if available, else fallback to date diff
            this._dt = t - (this._t || 1/60);
            this._t = t;
            return this._dt;
        },

        /**
         * gets an object from its id.
         *
         * @method get
         * @param {String} id
         * @return {D3D} d3d object
         */
        get: function(id) {
            return this._objects[id];
        },

        /**
         * creates a div object.
         *
         * @method createDiv
         * @param {String|undefined}   id        an optional id to set. if falsy div3d assigns it one automatically
         * @param {DOMElement|String}  parentEl  is a DOM element or a CSS selector to it. if ommitted the div gets assigned to the root node.
         * @return {D3D} d3d object
         */
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

        /**
         * imports an existing element from the DOM.
         *
         * @method importDiv
         * @param {DOMElement|String}  elOrSelector  DOM element or a CSS selector to it
         * @param {String|undefined}   optional id to assign to the element if it has none. if falsy div3d assigns it one automatically.
         * @return {D3D} d3d object
         */
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
         * creates a 6 sided box. The order of the faces is -x, +x, -y, +y, -z, +z.
         *
         * @method createBox
         * @param {Number[3]}                   dimensions  an array of 3 integers for x, y, and z dimensions
         * @param {DOMElement|String}           parentEl    the id or element where the box gets created. defaults to the top-level node
         * @param {Number[]}                    skips       an array of numbers ranging from 0 to 5. Each specified index gets skipped
         * @param {Function(face, index, dims)} forEach     a callback function that gets called on each created face
         */
        createBox: function(opts) {
            var dims, f, g = this.createDiv(opts.id, opts.parentEl);
            var a, b;

            g.faces = new Array(6);

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
                    f.scale(a);
                    mat4.multiplyVec3(f.matrix, a, f.matrix);
                }*/

                if (i < 6) {
                    f.rotate(rad90 * (i === 5 ? 2 : 1), boxStuff[i][1]);
                }
                if (opts.forEach) {
                    opts.forEach(f, i, dims);
                }

                f.update();

                g.faces[i] = f;
            }

            return g;
        },

        // TODO
        // **dimensions** an array of [x, y] dims
        // **faces** integer number of faces to generate
        // **axis** a versor vector?
        //createCylinder: function(opts) {
        //},



        // the remaining methods are used internally

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
