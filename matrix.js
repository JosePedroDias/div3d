var matrix = {

    precision: 1E-6,

    // identity
    I: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],

    translate: function (x, y, z) {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
    },

    rotate: function (rx, ry, rz) {
        var k = Math.cos(rx),
            a = Math.sin(rx),
            p = Math.cos(ry),
            c = Math.sin(ry),
            f = Math.cos(rz),
            d = Math.sin(rz),
            g = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        g[0] = p * f;
        g[1] = k * d + a * c * f;
        g[2] = a * d - k * c * f;
        g[4] = -p * d;
        g[5] = k * f - a * c * d;
        g[6] = a * f + k * c * d;
        g[8] = c;
        g[9] = -a * p;
        g[10] = k * p;
        return g;
    },

    rotateX: function(rx) {
        var c = Math.cos(rx),
            a = Math.sin(rx);
        return [1, 0, 0, 0, 0, c, a, 0, 0, -a, c, 0, 0, 0, 0, 1];
    },

    rotateY: function(ry) {
        var c = Math.cos(ry),
            a = Math.sin(ry);
        return [c, 0, -a, 0, 0, 1, 0, 0, a, 0, c, 0, 0, 0, 0, 1];
    },

    rotateZ: function(rz) {
        var c = Math.cos(rz),
            a = Math.sin(rz);
        return [c, a, 0, 0, -a, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    },

    scale: function (sx, sy, sz) {
        return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
    },

    // multiplication
    m: function e(a, c) {
        var d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        d[0] = a[0] * c[0] + a[1] * c[4] + a[2] * c[8] + a[3] * c[12];
        d[1] = a[0] * c[1] + a[1] * c[5] + a[2] * c[9] + a[3] * c[13];
        d[2] = a[0] * c[2] + a[1] * c[6] + a[2] * c[10] + a[3] * c[14];
        d[3] = a[0] * c[3] + a[1] * c[7] + a[2] * c[11] + a[3] * c[15];
        d[4] = a[4] * c[0] + a[5] * c[4] + a[6] * c[8] + a[7] * c[12];
        d[5] = a[4] * c[1] + a[5] * c[5] + a[6] * c[9] + a[7] * c[13];
        d[6] = a[4] * c[2] + a[5] * c[6] + a[6] * c[10] + a[7] * c[14];
        d[7] = a[4] * c[3] + a[5] * c[7] + a[6] * c[11] + a[7] * c[15];
        d[8] = a[8] * c[0] + a[9] * c[4] + a[10] * c[8] + a[11] * c[12];
        d[9] = a[8] * c[1] + a[9] * c[5] + a[10] * c[9] + a[11] * c[13];
        d[10] = a[8] * c[2] + a[9] * c[6] + a[10] * c[10] + a[11] * c[14];
        d[11] = a[8] * c[3] + a[9] * c[7] + a[10] * c[11] + a[11] * c[15];
        d[12] = a[12] * c[0] + a[13] * c[4] + a[14] * c[8] + a[15] * c[12];
        d[13] = a[12] * c[1] + a[13] * c[5] + a[14] * c[9] + a[15] * c[13];
        d[14] = a[12] * c[2] + a[13] * c[6] + a[14] * c[10] + a[15] * c[14];
        d[15] = a[12] * c[3] + a[13] * c[7] + a[14] * c[11] + a[15] * c[15];
        return 2 >= arguments.length ? d : e.apply(v, [d].concat(Array.prototype.slice.call(arguments, 2)));
    },

    // NOT SURE but seems the determinant
    det: function a(c, d) {
        var k = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        k[0] = c[0] * d[0] + c[1] * d[4] + c[2] * d[8];
        k[1] = c[0] * d[1] + c[1] * d[5] + c[2] * d[9];
        k[2] = c[0] * d[2] + c[1] * d[6] + c[2] * d[10];
        k[4] = c[4] * d[0] + c[5] * d[4] + c[6] * d[8];
        k[5] = c[4] * d[1] + c[5] * d[5] + c[6] * d[9];
        k[6] = c[4] * d[2] + c[5] * d[6] + c[6] * d[10];
        k[8] = c[8] * d[0] + c[9] * d[4] + c[10] * d[8];
        k[9] = c[8] * d[1] + c[9] * d[5] + c[10] * d[9];
        k[10] = c[8] * d[2] + c[9] * d[6] + c[10] * d[10];
        k[12] = c[12] * d[0] + c[13] * d[4] + c[14] * d[8] + d[12];
        k[13] = c[12] * d[1] + c[13] * d[5] + c[14] * d[9] + d[13];
        k[14] = c[12] * d[2] + c[13] * d[6] + c[14] * d[10] + d[14];
        return 2 >= arguments.length ? k : a.apply(v, [k].concat(Array.prototype.slice.call(arguments, 2)));
    },

    // returns position
    position: function(a) {
        return [a[12], a[13], a[14]];
    },

    // TODO DON'T KNOW REMAINING ONES. MUST HAVE QUATERNION AND SOME LERP-RELATED STUFF

    Z: function (a, c) {
        return [a[0], a[1], a[2], 0, a[4], a[5], a[6], 0, a[8], a[9], a[10], 0, a[12] + c[0], a[13] + c[1], a[14] + c[2], 1];
    },

    Fa: function(a, c, d) {
        return [1, 0, 0, 0, Math.tan(d), 1, 0, 0, Math.tan(c), Math.tan(a), 1, 0, 0, 0, 0, 1];
    },

    Oc: function(a) {
        var c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            d = a[5] * a[10] - a[6] * a[9],
            k = a[4] * a[10] - a[6] * a[8],
            p = a[4] * a[9] - a[5] * a[8],
            f = a[1] * a[10] - a[2] * a[9],
            g = a[0] * a[10] - a[2] * a[8],
            h = a[0] * a[9] - a[1] * a[8],
            j = a[1] * a[6] - a[2] * a[5],
            m = a[0] * a[6] - a[2] * a[4],
            s = a[0] * a[5] - a[1] * a[4],
            q = 1 / (a[0] * d - a[1] * k + a[2] * p);
        c[0] = q * d;
        c[1] = -q * f;
        c[2] = q * j;
        c[4] = -q * k;
        c[5] = q * g;
        c[6] = -q * m;
        c[8] = q * p;
        c[9] = -q * h;
        c[10] = q * s;
        c[12] = -a[12] * c[0] - a[13] * c[4] - a[14] * c[8];
        c[13] = -a[12] * c[1] - a[13] * c[5] - a[14] * c[9];
        c[14] = -a[12] * c[2] - a[13] * c[6] - a[14] * c[10];
        return c;
    },

    ka: function(a) {

        function c(a, c, d) {
            d || (d = 0);
            return Math.sqrt(a * a + c * c + d * d)
        }

        var d = c(a[0], a[1], a[2]);
        0 < a[0] && a[0] != d && (d *= -1);
        var k = a[0] + d,
            p = 2 / (k * k + a[1] * a[1] + a[2] * a[2]),
            d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        d[0] = 1 - p * k * k;
        d[1] = -p * k * a[1];
        d[2] = -p * k * a[2];
        d[5] = 1 - p * a[1] * a[1];
        d[6] = -p * a[1] * a[2];
        d[10] = 1 - p * a[2] * a[2];
        d[4] = d[1];
        d[8] = d[2];
        d[9] = d[6];
        k = g.t(a, d);
        p = c(k[5], k[6]);
        0 < k[5] && k[5] != p && (p *= -1);
        var p = k[5] + p,
            f = 2 / (p * p + k[6] * k[6]),
            h = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        h[5] = 1 - f * p * p;
        h[6] = -f * p * k[6];
        h[9] = h[6];
        h[10] = 1 - f * k[6] * k[6];
        d = g.t(d, h);
        k = g.t(a, d);
        p = g.K(0 > k[0] ? -1 : 1, 0 > k[5] ? -1 : 1, 0 > k[10] ? -1 : 1);
        k = g.t(p, k);
        d = g.t(d, p);
        p = {};
        p.translate = g.Qa(a);
        p.rotate = [Math.atan2(-d[6], d[10]), Math.asin(d[2]), Math.atan2(-d[1], d[0])];
        p.rotate[0] || (p.rotate[0] = 0, p.rotate[2] = Math.atan2(d[4], d[5]));
        p.scale = [k[0], k[5], k[10]];
        p.Fa = [Math.atan(k[9] / p.scale[2]), Math.atan(k[8] / p.scale[2]), Math.atan(k[4] / p.scale[0])];
        return p;
    },

    hf: function(a) {
        var c = g.K(a.scale[0], a.scale[1], a.scale[2]),
            d = g.Fa(a.Fa[0], a.Fa[1], a.Fa[2]),
            k = g.rotate(a.rotate[0], a.rotate[1], a.rotate[2]);
        return g.Z(g.t(c, d, k), a.translate);
    },

    Od: function(a, c) {
        if (!a || !c) return x;
        if (a == c) return t;
        for (var d = 0; d < a.length; d++) if (Math.abs(a[d] - c[d]) >= g.precision) return x;
        return t;
    },

    Wc: function(a) {
        a = a.slice(0);
        if (a[0] == Math.PI / 2 || a[0] == -Math.PI / 2) a[0] = -a[0], a[1] = Math.PI - a[1], a[2] -= Math.PI;
        a[0] > Math.PI / 2 && (a[0] -= Math.PI, a[1] = Math.PI - a[1], a[2] -= Math.PI);
        a[0] < -Math.PI / 2 && (a[0] += Math.PI, a[1] = -Math.PI - a[1], a[2] -= Math.PI);
        for (; a[1] < -Math.PI;) a[1] += 2 * Math.PI;
        for (; a[1] >= Math.PI;) a[1] -= 2 * Math.PI;
        for (; a[2] < -Math.PI;) a[2] += 2 * Math.PI;
        for (; a[2] >= Math.PI;) a[2] -= 2 * Math.PI;
        return a;
    }

};
