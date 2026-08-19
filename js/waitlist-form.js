/* Cognoscene waitlist form enhancement.
   Loaded by index.html when linked after the existing page markup/scripts.
   Keeps platform intent and mobile qualification separate from the founding offer.
*/
(function () {
  'use strict';

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
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

  onReady(function () {
    buildMobileAnchorNav();
  });
})();
