/* Bellish Architects — self-hosted cookie consent banner (Google Consent Mode v2).
   Must load BEFORE the GTM snippet. No third-party CMP required.
   API: window.__bellishConsent.open()  — re-open the banner (e.g. from the cookie policy page)
        window.__bellishConsent.status() — 'granted' | 'denied' | null                       */
(function () {
  if (window.__bellishConsent) return;
  var KEY = 'bellish-consent';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  /* ---- Consent Mode v2 defaults: deny everything until the visitor chooses ---- */
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });

  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}

  function applyConsent(v) {
    gtag('consent', 'update', {
      ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v
    });
    window.dataLayer.push({ event: v === 'granted' ? 'consent_accepted' : 'consent_declined' });
  }
  if (stored === 'granted') applyConsent('granted');

  /* ---- Banner UI ---- */
  var banner = null;

  function choose(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    stored = v;
    applyConsent(v);
    hide();
  }

  function hide() {
    if (banner) { banner.remove(); banner = null; }
  }

  function btn(label, primary) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.style.cssText =
      'font-family:Archivo,-apple-system,sans-serif;font-size:12px;letter-spacing:0.14em;' +
      'text-transform:uppercase;padding:12px 22px;cursor:pointer;border-radius:0;min-height:44px;' +
      (primary
        ? 'background:#F5F4F2;color:#111110;border:1px solid #F5F4F2;'
        : 'background:transparent;color:#F5F4F2;border:1px solid #56554F;');
    b.onmouseenter = function () { b.style.opacity = '0.75'; };
    b.onmouseleave = function () { b.style.opacity = '1'; };
    return b;
  }

  function show() {
    if (banner) return;
    banner = document.createElement('div');
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.style.cssText =
      'position:fixed;bottom:20px;left:20px;right:20px;max-width:440px;z-index:99990;' +
      'background:#111110;color:#F5F4F2;padding:26px 28px;box-shadow:0 8px 32px rgba(0,0,0,0.35);' +
      'font-family:Archivo,-apple-system,sans-serif;';

    var h = document.createElement('div');
    h.textContent = 'cookies';
    h.style.cssText = 'font-weight:800;font-size:22px;letter-spacing:-0.03em;text-transform:lowercase;margin-bottom:10px;';

    var p = document.createElement('p');
    p.style.cssText = 'font-size:13px;line-height:1.6;color:#A3A29C;margin:0 0 18px;';
    p.appendChild(document.createTextNode('We use cookies to measure how the site is used and improve it. Analytics runs only if you accept. '));
    var a = document.createElement('a');
    a.href = '/cookie-policy/';
    a.textContent = 'Cookie policy';
    a.style.cssText = 'color:#F5F4F2;text-decoration:underline;';
    p.appendChild(a);

    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap;';
    var accept = btn('Accept', true);
    var decline = btn('Decline', false);
    accept.onclick = function () { choose('granted'); };
    decline.onclick = function () { choose('denied'); };
    row.appendChild(accept);
    row.appendChild(decline);

    banner.appendChild(h);
    banner.appendChild(p);
    banner.appendChild(row);
    document.body.appendChild(banner);
    accept.focus({ preventScroll: true });
  }

  if (stored !== 'granted' && stored !== 'denied') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', show);
    } else {
      show();
    }
  }

  /* Any element with data-consent-open re-opens the banner (e.g. on the cookie policy page) */
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest && e.target.closest('[data-consent-open]');
    if (t) { e.preventDefault(); show(); }
  });

  window.__bellishConsent = {
    open: show,
    status: function () { return stored; }
  };
})();
