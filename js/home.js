(function () {
  'use strict';

  var track = document.getElementById('activityTrack');
  var dotWrap = document.getElementById('activityDots');
  if (!track || !dotWrap) return;

  var cards = Array.prototype.slice.call(track.querySelectorAll('.activity-card'));
  var dots = Array.prototype.slice.call(dotWrap.querySelectorAll('button'));
  if (!cards.length || dots.length !== cards.length) return;
  var initialIndex = Math.max(0, Math.min(cards.length - 1, parseInt(track.dataset.initialIndex || '0', 10) || 0));

  function currentIndex() {
    var trackRect = track.getBoundingClientRect();
    var center = trackRect.left + trackRect.width / 2;
    var best = 0;
    var bestDist = Infinity;
    cards.forEach(function (card, i) {
      var cardRect = card.getBoundingClientRect();
      var cardCenter = cardRect.left + cardRect.width / 2;
      var dist = Math.abs(cardCenter - center);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
  }

  function syncDots() {
    var i = currentIndex();
    dots.forEach(function (dot, idx) {
      var active = idx === i;
      dot.classList.toggle('active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function centerCard(index, behavior) {
    var card = cards[index];
    var trackRect = track.getBoundingClientRect();
    var cardRect = card.getBoundingClientRect();
    var maxLeft = track.scrollWidth - track.clientWidth;
    var left = track.scrollLeft + cardRect.left - trackRect.left
      - (track.clientWidth - cardRect.width) / 2;
    left = Math.max(0, Math.min(maxLeft, left));
    if (behavior === 'auto') {
      track.scrollLeft = left;
    } else {
      track.scrollTo({ left: left, behavior: 'smooth' });
    }
  }

  var ticking = false;
  track.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      syncDots();
      ticking = false;
    });
  }, { passive: true });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      centerCard(i, 'smooth');
    });
  });

  track.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    var next = currentIndex() + (e.key === 'ArrowRight' ? 1 : -1);
    next = Math.max(0, Math.min(cards.length - 1, next));
    centerCard(next, 'smooth');
  });

  centerCard(initialIndex, 'auto');
  syncDots();
})();
