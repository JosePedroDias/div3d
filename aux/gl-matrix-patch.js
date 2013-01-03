// TODO tweaked to work as css transform matrix3d

mat4.str = function(m) {
    var f = 6;
    return [
        m[ 0].toFixed(f), m[ 1].toFixed(f), m[ 2].toFixed(f), m[ 3].toFixed(f),
        m[ 4].toFixed(f), m[ 5].toFixed(f), m[ 6].toFixed(f), m[ 7].toFixed(f),
        m[ 8].toFixed(f), m[ 9].toFixed(f), m[10].toFixed(f), m[11].toFixed(f),
        m[12].toFixed(f), m[13].toFixed(f), m[14].toFixed(f), m[15].toFixed(f)
    ].join(',')
};
