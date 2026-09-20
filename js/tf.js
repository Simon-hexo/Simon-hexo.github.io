(function () {
  'use strict';

  // 移动端导航
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 横向滑动栏目：左右箭头
  document.querySelectorAll('.rail-nav').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var rail = document.getElementById(btn.getAttribute('data-rail'));
      if (!rail) return;
      var card = rail.querySelector('.rail-card');
      var step = card ? card.getBoundingClientRect().width + 20 : rail.clientWidth * 0.8;
      rail.scrollBy({ left: step * parseInt(btn.getAttribute('data-dir'), 10), behavior: 'smooth' });
    });
  });

  // 到达两端时置灰箭头
  document.querySelectorAll('.rail').forEach(function (rail) {
    var wrap = rail.closest('.rail-wrap');
    if (!wrap) return;
    var prev = wrap.querySelector('.rail-prev');
    var next = wrap.querySelector('.rail-next');
    function sync() {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      if (prev) prev.disabled = rail.scrollLeft <= 2;
      if (next) next.disabled = rail.scrollLeft >= max;
    }
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });
})();
