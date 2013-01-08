/*jshint debug:true */
/*global DIV3D:true, requestAnimationFrame:false */

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

    // 90 degrees in radians
    var rad90  = Math.PI / 2;
    var rad180 = Math.PI;

    // auxiliary stuff for the DIV3D.createBox() method
    var boxStuff = [
        [ [2, 1], [ 0, -1, 0], 0], // -x
        [ [2, 1], [ 0,  1, 0], 0], // +x
        [ [0, 2], [-1,  0, 0], 0], // -y
        [ [0, 2], [ 1,  0, 0], 0], // +y
        [ [0, 1], [ 0,  0, 0], 1], // -z
        [ [0, 1], [ 0,  1, 0], 1]  // +z
    ];


    /**
     * The DQuad class exposes an API to manipulate div3d quads (divs).
     *
     * This constructor isn't expected to be called by the end client but via DIV3D's create* methods.
     *
     * @class DQuad
     * @constructor
     * @param {DomElement}  el   the DOM element to assign to the object
     * @param {mat4}        mtx  the transformation matrix to assign to the object
     */
    var DQuad = function(el, mtx) {
        if (!mtx) {
            mtx = mat4.create(1);
            mat4.identity(mtx);
        }
        this._el   = el;
        this._mtx  = mtx;
        this._trans = {}; // t, r, s
    };

    DQuad.prototype = {

        /**
         * saves a translation transform for application in the object.
         *
         * @method translate
         * @param {Number[3]}  pos  is a 3 numbers array (dx, dy, dz)
         */
        translate: function(pos) {
            /*dbg assertVecN(pos, 3, '1st argument must be a Number[3]');*/

            this._trans.t = pos;
            DIV3D._needUpdate[ this._id ] = true;
        },

        /**
         * saves a rotation transform for application in the object.
         *
         * @method rotate
         * @param {Number}     angle  the angle to rotate around the axis, in radians
         * @param {Number[3]}  axis   is a 3D versor, that is, a 3 dimensions vector with norm 1
         */
        rotate: function(angle, axis) {
            /*dbg assertNumber(angle, '1st argument must be a Number');*/
            /*dbg assertVecN(axis, 3, '2nd argument must be a Number[3]');*/

            this._trans.r = [angle, axis];
            DIV3D._needUpdate[ this._id ] = true;
        },

        /**
         * saves a scaling transform for application in the object.
         *
         * @method _s
         * @param {Number|Number[3]}  s  can either be a number (for proportional scale) or a 3 dimensions vector
         */
        scale: function(s) {
            /*dbg assertVecN(s, 3, '1st argument must be a Number or Number[3]');*/

            this._trans.s = s;
            DIV3D._needUpdate[ this._id ] = true;
        },

        /**
         * sets the div dimensions. the divs keeps centered over its pivot point.
         *
         * @method resize
         * @param {Number[2]}            dims    an array of integers (width and height)
         * @param {Number[2]|undefined}  center  pivot location, specified in ratios of respective lengths
         */
        resize: function(dims, center) {
            /*dbg
            assertVecN(dims, 2, '1st argument must be a vector of 2 numbers');
            if (center !== undefined) {
                assertVecN(center, 2, '2nd argument must be a vector of 2 numbers');
            }
            */

            this._size = dims;
            var cir = [false, false];   // centerIsRatio
            var i, d, ci;

            if (!center) {
                center = [0.5, 0.5];
                cir = [true, true];
            }
            else {
                for (i = 0; i < 2; ++i) {
                    ci = center[i];
                    if (ci <= 1) {
                        cir[i] = true;
                    }
                }
            }

            for (i = 0; i < 2; ++i) {
                ci = center[i];
                d = dims[i];

                center[i] = Math.round( -d + ci * (cir[i] ? d : 1) );
            }

            var s = this._el.style;
            s.width      =   dims[0] + 'px';
            s.height     =   dims[1] + 'px';
            s.marginLeft = center[0] + 'px';
            s.marginTop  = center[1] + 'px';
        },

        /**
         * adds a CSS class / several classes to the object's DOM element.
         *
         * @method addClass
         * @param {String}  clsName  supports several classes separated by spaces
         */
        addClass: function(clsName) {
            /*dbg assertString(clsName, '1st argument must be a string');*/

            if (clsName.indexOf(' ') === -1) {
                this._el.classList.add(clsName);
            }
            else {
                var classes = clsName.split(' ');
                for (var i = 0, f = classes.length; i < f; ++i) {
                    this._el.classList.add( classes[i] );
                }
            }
        },

        /**
         * removes a CSS class / several classes from the object's DOM element.
         *
         * @method removeClass
         * @param {String}  clsName  supports several classes separated by spaces
         */
        removeClass: function(clsName) {
            /*dbg assertString(clsName, '1st argument must be a string');*/

            if (clsName.indexOf(' ') === -1) {
                this._el.classList.remove(clsName);
            }
            else {
                var classes = clsName.split(' ');
                for (var i = 0, f = classes.length; i < f; ++i) {
                    this._el.classList.remove( classes[i] );
                }
            }
        },

        /**
         * sets the object's opacity.
         *
         * @method opacity
         * @param {Number}  n  a float ranging from 0 to 1
         */
        opacity: function(n) {
            /*dbg assertBetween(n, 0, 1, '1st argument must be a number between 0 and 1');*/
            this._el.style.opacity = n;
        },

        /**
         * sets the object's color.
         *
         * @method color
         * @param {String}  c  can be any supported CSS color
         */
        color: function(c) {
            this._el.style.backgroundColor = c;
        },

        /**
         * sets the DOM element's inner HTML from the given markup.
         *
         * @param  {String}  html  markup to set
         */
        markup: function(html) {
            this._el.innerHTML = html;
        },

        /**
         * centers one line of text in the div.
         *
         * @method centerText
         */
        centerText: function() {
            var s = this._el.style;
            s.textAlign = 'center';
            s.lineHeight = this._size[1] + 'px';
        },



        /**
         * call this method once you're done with updating transformations to apply the matrix to the DOM element via transform: matrix3d()
         *
         * @private
         * @method _update
         */
        _update: function() {
            var m = ['matrix3d(', mat4.str(this._mtx), ')'].join('');
            this._el.style.WebkitTransform = m;
            this._el.style.MozTransform    = m;
            this._el.style.oTransform      = m;
            this._el.style.transform       = m;
        },

        /**
         * clears transformation matrix (sets it to the identity matrix).
         * use this prior to assigning a new set of matrices to transform an object.
         *
         * @private
         * @method _clear
         */
        _clear: function() {
            mat4.identity(this._mtx);
        },

        /**
         * immediate translation of the object's internal matrix.
         *
         * @private
         * @method _t
         * @param {Number[3]}  vec  is a 3 numbers array (dx, dy, dz)
         */
        _t: function(vec) {
            mat4.translate(this._mtx, this._mtx, vec);
        },

        /**
         * immediate rotation of the object's internal matrix.
         *
         * @private
         * @method _r
         * @param {Number}     angle  the angle to rotate around the axis, in radians
         * @param {Number[3]}  axis   is a 3D versor, that is, a 3 dimensions vector with norm 1
         */
        _r: function(angle, axis) {
            mat4.rotate(this._mtx, this._mtx, angle, axis);
        },

        /**
         * immediate scaling of the object's internal matrix.
         *
         * @private
         * @method _s
         * @param {Number|Number[3]}  s  can either be a number (for proportional scale) or a 3 dimensions vector
         */
        _s: function(s) {
            if (typeof s === 'number') {
                s = [s, s, s];
            }
            mat4.scale(this._mtx, this._mtx, s);
        },

        /**
         * returns a clone of the internal matrix.
         *
         * @private
         * @method clone
         * @returns {mat4}
         */
        _mtxClone: function() {
            return mat4.clone(this._mtx);
        },

        /**
         * implements the billboard behavior. TODO
         *
         * @private
         * @method _billboard
         * @param  {Number[3]}  pos  position
         */
        _billboard: function(pos) {
            // http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

            this._t(pos);

            mat4.copy(this._mtx, DIV3D._camera._mtx);
            mat4.transpose(this._mtx, this._mtx);

            var m = this._mtx;
            m[12] = pos[0];
            m[13] = pos[1];
            m[14] = pos[2];

            //_tmpMatrix.scale( object.scale );

            m[ 3] = 0;
            m[ 7] = 0;
            m[11] = 0;
            m[15] = 1;

            this._update();
        },

        /**
         * implements the axis-aligned billboard behavior. TODO
         *
         * @private
         * @method _billboardAxisAligned
         * @param  {Number[3]}  pos      position
         * @param  {Number}     axisNum  0 for X, 1 for Y, 2 for Z
         */
        _billboardAxisAligned: function(pos, axisNum) {
            // http://nehe.gamedev.net/article/billboarding_how_to/18011/
            // http://www.lighthouse3d.com/opengl/billboarding/index.php?billCyl

            var camPos = this._camera._from;

            var look = vec3.create();
            vec3.sub(look, camPos, pos); // create the look vector: pos -> camPos

            look[axisNum] = 0; // we are billboarding along the X axis - zero the look value for x
            vec3.normalize(look, look);

            var up = vec3.create();
            up[axisNum] = 1;

            var right = vec3.create(); // right hand rule cross products - the up vector is the +x Axis
            vec3.cross(right, up, look);

            var m = this._mtx;
            m[ 0] = right[0];
            m[ 1] = right[1];
            m[ 2] = right[2];
            m[ 3] = 0;
            m[ 4] = up[0];
            m[ 5] = up[1];
            m[ 6] = up[2];
            m[ 7] = 0;
            m[ 8] = look[0];
            m[ 9] = look[1];
            m[10] = look[2];
            m[11] = 0;
            m[12] = pos[0];
            m[13] = pos[1];
            m[14] = pos[2];
            m[15] = 1;

            this._update();
        }
    };



    /**
     * DIV3D public interface
     *
     * @class DIV3D
     * @static
     */
    DIV3D = {

        _containerDims:   [0, 0],
        _lastId:          1,
        _startT:          undefined,
        _objects:         {},
        _needUpdate:      {},
        _lookAtDependent: {},
        _animationFn:     [],

        /**
         * should be called once at the start.
         *
         * @method init
         */
        init: function(ctnEl) {
            /*log 'DIV3D.init() called'*/

            this._startT = new Date().valueOf();

            if (!ctnEl) {
                ctnEl = document.createElement('div');
                ctnEl.className = 'container';
                ctnEl.id = 'd' + this._lastId++;
                document.body.appendChild(ctnEl);
            }

            this._finishDiv(ctnEl, ctnEl.id);

            this._root0  = this._createDiv('root0',  ctnEl.id);
            this._camera = this._createDiv('camera', 'root0');
            this._root   = this._createDiv('root',   'camera');

            this._camera._from = [0, -100, 0]; // TODO

            this._onResize();
            window.addEventListener('resize', function() { DIV3D._onResize(); });

            var render = function(t) {
                var dt = DIV3D.time(t);

                DIV3D._updateDOM();

                DIV3D._applyAnimations(t, dt);

                requestAnimationFrame(render);
            };

            render();
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
         * updates point of view.
         *
         * @method lookAt
         * @param {Number[3]}            from  origin vector. location of the camera
         * @param {Number[3]|undefined}  to    target vector. defaults to [0, 0, 0]
         * @param {Number[3]|undefined}  up    up vector.     defaults to [0, 1, 0]
         */
        setCamera: function(o) {
            var from = o.from || this._camera._from;
            var to   = o.to   || this._camera._to    || [0, 0, 0];
            var up   = o.up   || this._camera._up    || [0, 1, 0];

            mat4.lookAt(this._camera._mtx, from, to, up);
            this._camera._update();

            this._camera._from = from;
            this._camera._to   = to;
            this._camera._up   = up;

            for (var id in this._lookAtDependent) {
                o = this._objects[id];
                o._billboard(o._position);
            }
        },

        /**
         * sets a cube map to the scene (inverted cube with 6 images assigned).
         * should be called at most once.
         *
         * @method setCubeMap
         * @param {Object} opts
         *   @param {Number}  size   cube size in world pixels
         *   @param {String}  image  uri to the images. use the $ for automatic replacement for 0-5
         */
        setCubeMap: function(opts) {
            this._cubeMap = this.createBox({
                invert:     true,
                dimensions: [opts.size, opts.size, opts.size],
                forEach: function(f, i) {
                    var s = f._el.style;
                    s.backgroundImage = ['url(', opts.image.replace('$', i), ')'].join('');
                    s.backgroundSize  = '100% 100%';
                    f.markup(i);
                    f.opacity(0.5);
                    s.color = '#FFF';
                    s.fontSize = ~~(opts.size*0.75) + 'px';
                    s.lineHeight = opts.size + 'px';
                    s.textAlign = 'center';
                }
            });
        },

        /**
         * adds a callback function that gets called every time a new frame is to rendered.
         *
         * @method onFrame
         * @param  {Function}  fn  callback function. receives params t and dt
         */
        onFrame: function(fn) {
            this._animationFn.push(fn);
        },

        /**
         * creates a group div. should have no visual representation.
         *
         * @method createGroup
         * @param  {String|undefined}  id      id to assign to the new div/object
         * @param  {String|undefined}  parent  parent object's id
         * @return {DQuad}
         */
        createGroup: function(id, parent) {
            return this._createDiv(id, parent);
        },

        /**
         * creates a regular div rect.
         *
         * @method createRect
         * @param {Object} opts
         *   @param {String}     id
         *   @param {String}     parent
         *   @param {Number[2]}  size
         *   @param {String}     classes
         *   @param {String}     markup
         *   @param {String}     color
         * @return {DQuad}
         */
        createRect: function(opts) {
            var o = this._createDiv(opts.id, opts.parent);
            if ('size'    in opts) { o.resize(   opts.size);    }
            if ('classes' in opts) { o.addClass( opts.classes); }
            if ('markup'  in opts) { o.markup(   opts.markup);  }
            if ('color'   in opts) { o.color(    opts.color);   }
            return o;
        },

        /**
         * creates a billboard div rect.
         *
         * @method createRect
         * @param {Object} opts
         *   @param {String}     id
         *   @param {String}     parent
         *   @param {Number[2]}  size
         *   @param {String}     classes
         *   @param {String}     markup
         *   @param {String}     color
         *   @param {Number[3]}  position
         * @return {DQuad}
         */
        createBillboard: function(opts) {
            var o = this.createRect(opts);
            o.translate(opts.position);
            this._lookAtDependent[o._id] = true;
            o._billboard(o._position);
        },

        /**
         * creates a 6 sided box. The order of the faces is -x, +x, -y, +y, -z, +z.
         *
         * @method createBox
         * @param {Object} opts
         *   @param {String}                       id
         *   @param {Number[3]}                    dimensions  an array of 3 integers for x, y, and z dimensions
         *   @param {DOMElement|String}            parent      the id or element where the box gets created. defaults to the top-level node
         *   @param {Number[]}                     skips       an array of numbers ranging from 0 to 5. Each specified index gets skipped
         *   @param {Boolean}                      invert      inverts face normals
         *   @param {Function(face, index, dims)}  forEach     a callback function that gets called on each created face
         * @return {DQuad}
         */
        createBox: function(opts) {
            var dims, f, g = this._createDiv(opts.id, opts.parent);
            var a, b, bs;

            g.faces = new Array(6);

            for (var i = 0; i < 6; ++i) {
                if (opts.skips && opts.skips.indexOf(i) !== -1) { continue; }
                f = this._createDiv(undefined, g._el);
                bs = boxStuff[i];
                a = bs[0];
                b = opts.dimensions;
                dims = [b[a[0]], b[a[1]]];
                f.resize(dims);

                a = [0, 0, 0];
                b = ~~(i / 2);

                a[b] = opts.dimensions[b] / (i % 2 ? -2 : 2) * (b === 0 ? -1 : 1);
                f._t(a);

                if (i < 6) {
                    f._r(rad90 * (i === 5 ? 2 : 1), bs[1]);
                }

                if (opts.invert) {
                    //if (boxStuff[i][2]) { f._r(rad180, [1, 0, 0]); }

                    if      (i < 2) { f._r(rad180, [0, 1, 0]); }
                    else if (i > 3) { f._r(rad180, [1, 0, 0]); f._r(rad180, [0, 0, 1]); }
                    else {            f._r(rad180, [1, 0, 0]); }
                }

                if (opts.forEach) { opts.forEach(f, i, dims); }

                f._update();

                g.faces[i] = f;
            }

            return g;
        },

        // createCylinder
        // createGrid
        // createLine



        // the remaining methods are used internally

        /**
         * creates a div object.
         *
         * @private
         * @method _createDiv
         * @param {String|undefined}             id      an optional id to set. if falsy div3d assigns it one automatically
         * @param {String|DOMElement|undefined}  parent  is a DOM element or an id. if ommitted the div gets assigned to the root node.
         * @return {D3D} d3d object
         */
        _createDiv: function(id, parent) {
            var el = document.createElement('div');
            el.className = 'node';
            if (!id) {
                id = 'd' + this._lastId++;
            }
            el.id = id;

            if (!parent) { parent = 'root'; }

            if (typeof parent === 'string') {
                parent = this.get(parent);
            }

            if (!parent.parentNode) {
                parent = parent._el;
            }
            parent.appendChild(el);

            return this._finishDiv(el, id);
        },

        /**
         * register the new div.
         *
         * @private
         * @method _finishDiv
         * @param  {DOMElement}  el
         * @param  {String}      id
         * @return {DQuad}
         */
        _finishDiv: function(el, id) {
            var o = new DQuad(el);
            o._id = id;
            this._objects[id] = o;
            return o;
        },

        /**
         * updates the DOM.
         *
         * @private
         * @method _updateDOM
         */
        _updateDOM: function() {
            var o, id, p;
            for (id in this._needUpdate) {
                o = this._objects[id];
                o._clear();
                p = o._trans.s; if (p) { o._s(p); }
                p = o._trans.r; if (p) { o._r(p[0], p[1]); }
                p = o._trans.t; if (p) { o._t(p); }
                o._update();
            }

            this._needUpdate = {};
        },

        /**
         * called internally prior to frame rendering.
         *
         * @private
         * @method _applyAnimations
         * @param  {Number}  t   time in seconds since the beginning of execution
         * @param  {Number}  dt  time it took since last frame rendering, in seconds
         */
        _applyAnimations: function(t, dt) {
            var i, f, fn;
            for (i = 0, f = this._animationFn.length; i < f; ++i) {
                fn = this._animationFn[i];
                fn(t, dt);
            }
        },

        /**
         * callback that gets called on window resize.
         *
         * @private
         * @method _onResize
         */
        _onResize: function() {
            var W = window.innerWidth;
            var H = window.innerHeight;
            this._containerDims = [W, H];

            /*
            // shameless rip of http://mrdoob.github.com/three.js/examples/js/renderers/CSS3DRenderer.js

            var camFov = 75 * Math.PI / 180; // in radians
            var fov = 0.5 / Math.tan(camFov * 0.5) * H;

            var root0 = this._root0;
            var cam   = this._camera;

            var s = root0._el.style;
            s.WebkitPerspectiveOriginX = '50%';
            s.WebkitPerspectiveOriginY = '50%';
            s.WebkitPerspective = fov.toFixed(4) + 'px';

            var from = [0, 0, 0];
            var to   = [0, 0, 1];
            var up   = [0, 1, 0];
            mat4.lookAt(cam._mtx, from, to, up);
            mat4.invert(cam._mtx, cam._mtx);

            s = cam._el.style;
            s.WebkitTransform = [
                'translate3d(0, 0, ', fov.toFixed(4), 'px) ',
                'matrix3d(', mat4.str(cam._mtx), ') ',
                'translate3d(', W/2, 'px, ', H/2, 'px, 0)'
            ].join('');*/

            var o = this._root0;
            o._clear();
            o._t([W/2, H/2, 0]);
            o._update();
        }

    };

})();
