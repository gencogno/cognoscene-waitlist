(function initLayerEdgeGradients() {
  function start() {
    var layerIndex = document.querySelector('.layers-index');
    if (!layerIndex || window.matchMedia('(max-width: 760px)').matches === false) return;

    var cards = Array.prototype.slice.call(layerIndex.querySelectorAll('.layer-index-item'));
    if (!cards.length) return;

    var edgeRange = 72;
    var rafId = null;

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function update() {
      rafId = null;
      var bounds = layerIndex.getBoundingClientRect();
      cards.forEach(function (card) {
        var rect = card.getBoundingClientRect();
        var leftDistance = Math.max(0, rect.left - bounds.left);
        var rightDistance = Math.max(0, bounds.right - rect.right);
        card.style.setProperty('--edge-left-opacity', (1 - clamp(leftDistance / edgeRange, 0, 1)).toFixed(3));
        card.style.setProperty('--edge-right-opacity', (1 - clamp(rightDistance / edgeRange, 0, 1)).toFixed(3));
      });
    }

    function schedule() {
      if (rafId === null) rafId = requestAnimationFrame(update);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);

    function tick() {
      schedule();
      requestAnimationFrame(tick);
    }

    tick();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
