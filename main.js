/* brackets.hr — the only script on the page. Theme toggle, nothing else. */

(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.querySelector('.switch');
  var label = toggle && toggle.querySelector('.switch__label');
  var system = window.matchMedia('(prefers-color-scheme: dark)');

  if (!toggle) return;

  function store(value) {
    try {
      if (value) localStorage.setItem('theme', value);
      else localStorage.removeItem('theme');
    } catch (e) {
      /* private mode or blocked storage — the toggle still works for this visit */
    }
  }

  /* What the visitor is actually looking at right now. */
  function current() {
    return root.dataset.theme || (system.matches ? 'dark' : 'light');
  }

  /* The label names the destination, not the state — it's a button, not a status. */
  function sync() {
    var dark = current() === 'dark';
    toggle.setAttribute('aria-pressed', String(dark));
    if (label) label.textContent = dark ? 'Light' : 'Dark';
  }

  toggle.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    store(next);
    sync();
  });

  /* Follow the OS only while the visitor hasn't overridden it. */
  system.addEventListener('change', function () {
    if (!root.dataset.theme) sync();
  });

  sync();
})();
