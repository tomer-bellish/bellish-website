// Google Preferred Sources — bellish.co.il
(function () {
  var ps = null;
  (self.PREFERRED_SOURCE = self.PREFERRED_SOURCE || []).push(function (p) {
    ps = p;
    p.init({ theme: 'dark', lang: 'en' });
  });
  var tries = 0;
  function mount() {
    if (document.getElementById('gps-btn')) return true;
    var spans = document.querySelectorAll('span');
    var target = null;
    for (var i = 0; i < spans.length; i++) {
      if (spans[i].textContent.indexOf('Bellish Architects.') > -1) { target = spans[i]; break; }
    }
    if (!target) return false;
    var row = target.parentNode;
    var btn = document.createElement('button');
    btn.id = 'gps-btn';
    btn.type = 'button';
    btn.textContent = 'add bellish as a preferred source on google \u2197';
    btn.setAttribute('aria-label', 'Add Bellish Architects as a preferred source on Google');
    btn.style.cssText = 'background:none;border:none;padding:0;margin:0;color:inherit;font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer;text-decoration:underline;text-underline-offset:3px;';
    btn.addEventListener('click', function () {
      if (ps) { ps.addPreferredSource(); }
      else {
        (self.PREFERRED_SOURCE = self.PREFERRED_SOURCE || []).push(function (p) { p.addPreferredSource(); });
      }
    });
    row.insertBefore(btn, row.lastElementChild);
    return true;
  }
  function loop() {
    if (!mount() && ++tries < 60) setTimeout(loop, 500);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loop);
  else loop();
})();
