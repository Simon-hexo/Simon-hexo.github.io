(function () {
  'use strict';

  /* ---------- 移动端导航 ---------- */
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

  /* ---------- 横向滑动栏目 ---------- */
  document.querySelectorAll('.rail-nav').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var rail = document.getElementById(btn.getAttribute('data-rail'));
      if (!rail) return;
      var card = rail.querySelector('.rail-card');
      var step = card ? card.getBoundingClientRect().width + 20 : rail.clientWidth * 0.8;
      rail.scrollBy({ left: step * parseInt(btn.getAttribute('data-dir'), 10), behavior: 'smooth' });
    });
  });

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

  /* ---------- 转化事件：点击购买 / 咨询 / 了解更多 ----------
     统计口径：
       1. 页面浏览 —— 由 Cloudflare Web Analytics 自动收集（边缘注入，无需代码）
       2. 点击转化 —— 走 GA4。主题配置里填上 ga4: G-XXXXXXX 即自动生效
     未配置 GA4 时这里静默跳过，不影响任何功能。
  */
  var hasGA = typeof window.gtag === 'function';
  document.querySelectorAll('[data-tf-event]').forEach(function (el) {
    el.addEventListener('click', function () {
      var name = el.getAttribute('data-tf-event');
      var label = el.getAttribute('data-tf-label') || '';
      if (hasGA) {
        window.gtag('event', name, {
          event_category: 'engagement',
          event_label: label,
          link_url: el.getAttribute('href') || ''
        });
      }
    });
  });
})();
