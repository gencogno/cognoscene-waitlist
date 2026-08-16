/* Cognoscene waitlist form enhancement.
   Loaded by index.html when linked after the existing page markup/scripts.
   Keeps platform intent and mobile qualification separate from the founding offer.
*/
(function () {
  'use strict';

  var MOBILE_CAVEAT = 'if you ticked this, that means you believe a mobile version that disrupts shopping impulses would help you immensely to prevent shopping-centric financial vulnerabilities & purchase regret.';

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function buildPlatformField(form) {
    if (!form || form.querySelector('[data-platform-field]')) return;

    var email = form.querySelector('#email');
    var legal = form.querySelector('input[name="legal"]');
    if (!email || !legal || !legal.closest('.form-check')) return;

    var legacyReady = form.querySelector('input[name="ready"]');
    if (legacyReady) {
      var readyRow = legacyReady.closest('.form-check');
      if (readyRow) readyRow.remove();
    }

    var fieldRow = document.createElement('div');
    fieldRow.className = 'waitlist-platform-field';
    fieldRow.setAttribute('data-platform-field', '');

    var legend = document.createElement('p');
    legend.className = 'waitlist-platform-label';
    legend.textContent = 'where would you want cognoscene?';
    fieldRow.appendChild(legend);

    var options = [
      { value: 'chrome', label: 'chrome' },
      { value: 'mobile', label: 'mobile' },
      { value: 'both', label: 'both' }
    ];

    var pills = document.createElement('div');
    pills.className = 'waitlist-platform-options';

    options.forEach(function (option) {
      var label = document.createElement('label');
      label.className = 'radio-pill';

      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'platform';
      input.value = option.value;
      input.required = true;

      var text = document.createElement('span');
      text.textContent = option.label;

      label.appendChild(input);
      label.appendChild(text);
      pills.appendChild(label);
      input.addEventListener('change', updateMobileCaveat);
    });

    fieldRow.appendChild(pills);

    var caveat = document.createElement('p');
    caveat.className = 'waitlist-mobile-caveat';
    caveat.hidden = true;
    caveat.textContent = MOBILE_CAVEAT;
    fieldRow.appendChild(caveat);

    var legalRow = legal.closest('.form-check');
    legalRow.parentNode.insertBefore(fieldRow, legalRow);

    function updateMobileCaveat() {
      var selected = form.querySelector('input[name="platform"]:checked');
      var isMobile = selected && (selected.value === 'mobile' || selected.value === 'both');
      caveat.hidden = !isMobile;
    }
  }

  function patchFormspreePayload() {
    if (!window.fetch || window.__cognosceneWaitlistFetchPatched) return;
    window.__cognosceneWaitlistFetchPatched = true;

    var originalFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
      if (url.indexOf('https://formspree.io/f/') !== 0 || !init || typeof init.body !== 'string') {
        return originalFetch(input, init);
      }

      try {
        var payload = JSON.parse(init.body);
        var form = document.getElementById('waitlistForm');
        var selected = form && form.querySelector('input[name="platform"]:checked');
        payload.platform = selected ? selected.value : '';
        delete payload.ready;
        init.body = JSON.stringify(payload);
      } catch (error) {
        // Preserve the existing submission behavior if payload parsing fails.
      }

      return originalFetch(input, init);
    };
  }

  function initLayerEdgeGradients() {
    if (!window.matchMedia('(max-width: 760px)').matches) return;

    var layerIndex = document.querySelector('.layers-index');
    if (!layerIndex) return;

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
      if (rafId === null) rafId = window.requestAnimationFrame(update);
    }

    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);

    function tick() {
      schedule();
      window.requestAnimationFrame(tick);
    }

    tick();
  }

  onReady(function () {
    var form = document.getElementById('waitlistForm');
    if (form) {
      patchFormspreePayload();
      buildPlatformField(form);
    }
    initLayerEdgeGradients();
  });
})();
