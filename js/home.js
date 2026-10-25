(function () {
  'use strict';

  var track = document.getElementById('activityTrack');
  var dotWrap = document.getElementById('activityDots');
  if (!track || !dotWrap) return;

  var cards = Array.prototype.slice.call(track.querySelectorAll('.activity-card'));
  var dots = Array.prototype.slice.call(dotWrap.querySelectorAll('button'));
  if (!cards.length || dots.length !== cards.length) return;

  function currentIndex() {
    var center = track.scrollLeft + track.clientWidth / 2;
    var best = 0;
    var bestDist = Infinity;
    cards.forEach(function (card, i) {
      var cardCenter = card.offsetLeft - track.offsetLeft + card.offsetWidth / 2;
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
      cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  });

  track.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    var next = currentIndex() + (e.key === 'ArrowRight' ? 1 : -1);
    next = Math.max(0, Math.min(cards.length - 1, next));
    cards[next].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  });

  syncDots();
})();
