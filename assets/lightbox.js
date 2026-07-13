/* Bellish Architects — gallery lightbox with prev/next navigation.
   Creates #lightbox immediately (guards against the older inline lightbox). */
(function () {
  if (window.__lbInit) return; window.__lbInit = true;

  var imgs = [], idx = 0;

  var lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-label', 'Image viewer');
  lb.style.cssText = 'position:fixed; inset:0; z-index:200; display:none; align-items:center; justify-content:center; padding:clamp(16px,4vw,56px); background:rgba(17,17,16,0.94); cursor:zoom-out; opacity:0; transition:opacity .3s ease;';

  var lbImg = document.createElement('img');
  lbImg.id = 'lightbox-img'; lbImg.alt = '';
  lbImg.style.cssText = 'max-width:100%; max-height:100%; object-fit:contain; display:block; box-shadow:0 30px 80px rgba(0,0,0,0.5); transform:scale(.96); transition:transform .3s cubic-bezier(.22,.61,.36,1), opacity .18s ease; cursor:default;';
  lbImg.addEventListener('click', function (e) { e.stopPropagation(); });

  function mkBtn(label, char, css) {
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-label', label); b.textContent = char;
    b.style.cssText = 'position:absolute; background:rgba(245,244,242,0.06); border:1px solid rgba(245,244,242,0.3); color:#F5F4F2; cursor:pointer; display:flex; align-items:center; justify-content:center; border-radius:50%; width:clamp(44px,6vw,54px); height:clamp(44px,6vw,54px); font-size:26px; line-height:1; padding:0 0 3px; transition:background .2s ease, border-color .2s ease;' + css;
    b.addEventListener('mouseenter', function () { b.style.background = 'rgba(245,244,242,0.18)'; b.style.borderColor = '#F5F4F2'; });
    b.addEventListener('mouseleave', function () { b.style.background = 'rgba(245,244,242,0.06)'; b.style.borderColor = 'rgba(245,244,242,0.3)'; });
    return b;
  }

  var lbClose = mkBtn('Close', '\u2715', 'top:clamp(14px,3vw,28px); right:clamp(14px,3vw,28px); border:none; background:none; font-size:28px; border-radius:0;');
  lbClose.addEventListener('mouseenter', function () { lbClose.style.background = 'none'; });
  var lbPrev = mkBtn('Previous image', '\u2190', 'left:clamp(10px,2.5vw,28px); top:50%; transform:translateY(-50%);');
  var lbNext = mkBtn('Next image', '\u2192', 'right:clamp(10px,2.5vw,28px); top:50%; transform:translateY(-50%);');

  var lbCount = document.createElement('div');
  lbCount.style.cssText = 'position:absolute; bottom:clamp(14px,3vw,26px); left:50%; transform:translateX(-50%); color:rgba(245,244,242,0.75); font-size:13px; letter-spacing:0.18em; font-variant-numeric:tabular-nums; cursor:default; user-select:none;';
  lbCount.addEventListener('click', function (e) { e.stopPropagation(); });

  lb.appendChild(lbImg); lb.appendChild(lbClose); lb.appendChild(lbPrev); lb.appendChild(lbNext); lb.appendChild(lbCount);

  function fullSrc(im) { return im.getAttribute('data-full') || im.getAttribute('src') || im.currentSrc || im.src; }

  function render() {
    var im = imgs[idx];
    if (!im) return;
    lbImg.style.opacity = '0';
    var next = fullSrc(im);
    var pre = new Image();
    pre.onload = pre.onerror = function () { lbImg.src = next; lbImg.alt = im.alt || ''; lbImg.style.opacity = '1'; };
    pre.src = next;
    lbCount.textContent = (idx + 1) + ' / ' + imgs.length;
    var one = imgs.length < 2;
    lbPrev.style.display = one ? 'none' : 'flex';
    lbNext.style.display = one ? 'none' : 'flex';
    lbCount.style.display = one ? 'none' : 'block';
    // preload neighbours
    if (!one) {
      [imgs[(idx + 1) % imgs.length], imgs[(idx - 1 + imgs.length) % imgs.length]].forEach(function (n) {
        var p = new Image(); p.src = fullSrc(n);
      });
    }
  }

  function step(d) { if (imgs.length < 2) return; idx = (idx + d + imgs.length) % imgs.length; render(); }

  function openLb(im) {
    imgs = Array.prototype.slice.call(document.querySelectorAll('img.zoomable'));
    idx = Math.max(0, imgs.indexOf(im));
    render();
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { lb.style.opacity = '1'; lbImg.style.transform = 'scale(1)'; });
  }

  function closeLb() {
    lb.style.opacity = '0'; lbImg.style.transform = 'scale(.96)';
    document.body.style.overflow = '';
    setTimeout(function () { lb.style.display = 'none'; }, 300);
  }

  lb.addEventListener('click', closeLb);
  lbClose.addEventListener('click', function (e) { e.stopPropagation(); closeLb(); });
  lbPrev.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
  lbNext.addEventListener('click', function (e) { e.stopPropagation(); step(1); });

  document.addEventListener('keydown', function (ev) {
    if (lb.style.display !== 'flex') return;
    if (ev.key === 'Escape') closeLb();
    else if (ev.key === 'ArrowRight') { ev.preventDefault(); step(1); }
    else if (ev.key === 'ArrowLeft') { ev.preventDefault(); step(-1); }
  });

  // swipe
  var tX = null;
  lb.addEventListener('touchstart', function (ev) { if (ev.touches.length === 1) tX = ev.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (ev) {
    if (tX === null) return;
    var dx = ev.changedTouches[0].clientX - tX; tX = null;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  document.addEventListener('click', function (ev) {
    var im = ev.target.closest && ev.target.closest('img.zoomable');
    if (im) openLb(im);
  });

  (document.body || document.documentElement).appendChild(lb);
})();
