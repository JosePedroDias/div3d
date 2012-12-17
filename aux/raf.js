// cross-browser requestAnimationFrame
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(cb, element) {window.setTimeout(cb, 1000 / 30);};
}
