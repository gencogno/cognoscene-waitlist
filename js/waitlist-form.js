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
    if (!form) return;

    var existingDynamicField = form.querySelector('[data-platform-field]');
    if (existingDynamicField) return;

    /* Remove the older inline platform field before inserting the current one. */
    var legacyField = form.querySelector('.form-platform');
    if (legacyField) legacyField.remove();

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

  function buildMobileAnchorNav() {
    if (document.querySelector('.anchor-nav')) return;

    var hero = document.querySelector('.hero');
    if (!hero) return;

    var nav = document.createElement('nav');
    nav.className = 'anchor-nav';
    nav.setAttribute('aria-label', 'page sections');

    var inner = document.createElement('div');
    inner.className = 'anchor-nav-inner';

    [
      { id: 'problem', label: 'problem' },
      { id: 'solution', label: 'solution' },
      { id: 'waitlist', label: 'waitlist' }
    ].forEach(function (item) {
      var link = document.createElement('a');
      link.className = 'anchor-nav-link';
      link.href = '#' + item.id;
      link.textContent = item.label;
      link.dataset.anchorTarget = item.id;
      inner.appendChild(link);
    });

    nav.appendChild(inner);
    hero.insertAdjacentElement('afterend', nav);

    if (!('IntersectionObserver' in window)) return;

    var links = Array.prototype.slice.call(nav.querySelectorAll('.anchor-nav-link'));
    var sections = links
      .map(function (link) { return document.getElementById(link.dataset.anchorTarget); })
      .filter(Boolean);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle('is-active', link.dataset.anchorTarget === entry.target.id);
        });
      });
    }, {
      rootMargin: '-96px 0px -55% 0px',
      threshold: 0
    });

    sections.forEach(function (section) { observer.observe(section); });
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

  onReady(function () {
    buildMobileAnchorNav();

    var form = document.getElementById('waitlistForm');
    if (form) {
      patchFormspreePayload();
      buildPlatformField(form);
    }
  });
})();
