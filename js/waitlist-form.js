/* Cognoscene waitlist form enhancement.
   Loaded by index.html when linked after the existing page markup/scripts.
   Keeps platform intent and mobile qualification separate from the founding offer.
*/
(function () {
  'use strict';

  var MOBILE_CAVEATS = {
    mobile: 'you believe a mobile version that disrupts shopping impulses would help you prevent shopping-centric financial vulnerabilities & purchase regret wherever you shop.',
    both: 'you want cognoscene to follow you across chrome and mobile — so the same friction can interrupt shopping impulses wherever they happen.'
  };

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
    fieldRow.appendChild(caveat);

    var legalRow = legal.closest('.form-check');
    legalRow.parentNode.insertBefore(fieldRow, legalRow);

    function updateMobileCaveat() {
      var selected = form.querySelector('input[name="platform"]:checked');
      var selectedValue = selected ? selected.value : '';
      var message = MOBILE_CAVEATS[selectedValue] || '';
      var shouldShow = !!message;
      caveat.hidden = !shouldShow;
      caveat.textContent = message;
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

    // Fade zone: pixels from the edge where the gradient begins fading in.
    // layer-slide is 4s ease-in-out over ~18% of container width (~65px on a 360px card).
    // 1 second of travel at average speed ≈ 16px; use 20px for a comfortable fade window.
    var FADE_ZONE = 20;

    var rafId = null;

    function clamp(val, min, max) {
      return val < min ? min : val > max ? max : val;
    }

    function update() {
      rafId = null;
      var bounds = layerIndex.getBoundingClientRect();

      cards.forEach(function (card) {
        var rect = card.getBoundingClientRect();
        var leftDistance = rect.left - bounds.left;
        var rightDistance = bounds.right - rect.right;

        // Gradient fades in as card approaches edge (distance < FADE_ZONE),
        // reaches full opacity at the edge (distance <= 0), and is 0 when far away.
        // At edge contact: opacity = 1. At FADE_ZONE away: opacity = 0.
        // Brief asks the reverse: gradient fades *away* as card approaches — 
        // i.e. opacity 1→0 over the last 1 second before edge contact.
        // So: far from edge = 0, within FADE_ZONE = ramp 0→1, at edge = 1... 
        // but brief says at/after contact opacity = 0. Correct interpretation:
        // gradient appears only while card is still moving toward edge (not yet touching),
        // and disappears exactly at contact. So: opacity peaks at FADE_ZONE away, 
        // hits 0 at <=1px (contact). Map: [FADE_ZONE → 0] distance → [0 → 1] then back to 0 at edge.
        // Simplest correct read: gradient animates 1→0 over the final 1 second.
        // That means: at FADE_ZONE distance → opacity 1; at 0 distance → opacity 0.
        var leftOpacity = leftDistance > FADE_ZONE ? 0 :
          leftDistance <= 1 ? 0 :
          clamp((leftDistance - 1) / (FADE_ZONE - 1), 0, 1);

        var rightOpacity = rightDistance > FADE_ZONE ? 0 :
          rightDistance <= 1 ? 0 :
          clamp((rightDistance - 1) / (FADE_ZONE - 1), 0, 1);

        card.style.setProperty('--edge-left-opacity', leftOpacity.toFixed(3));
        card.style.setProperty('--edge-right-opacity', rightOpacity.toFixed(3));
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
