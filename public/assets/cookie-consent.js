/* Bellish Architects — self-hosted cookie consent (opt-in, Google Consent Mode v2).
   Load this first in <head>. Nothing that talks to Google — GA4, Preferred Sources — is loaded until the
   visitor accepts ("basic" consent mode), so no data leaves the browser before a choice is made.
   The choice is stored in localStorage and asked again after 12 months.
   API: window.__bellishConsent.open()   — re-open the banner (any element with data-consent-open also does)
        window.__bellishConsent.status() — 'granted' | 'denied' | null                                      */
(function () {
  if (window.__bellishConsent) return;
  var KEY = 'bellish-consent';
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000;
  var GA_ID = 'G-4TLRV6RJNT';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  });

  /* Stored as {"v":"granted"|"denied","t":<ms>}; older plain-string values are accepted and re-dated. */
  function read() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { return null; }
    if (raw === 'granted' || raw === 'denied') { write(raw); return raw; }
    try {
      var o = JSON.parse(raw);
      if (o && (o.v === 'granted' || o.v === 'denied') && Date.now() - o.t < MAX_AGE) return o.v;
    } catch (e) {}
    return null;
  }
  function write(v) { try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {} }

  function addScript(src, attrs) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    for (var k in attrs || {}) s.setAttribute(k, attrs[k]);
    document.head.appendChild(s);
  }

  var loaded = false;
  function loadTags() {
    if (loaded) return;
    loaded = true;
    addScript('https://www.googletagmanager.com/gtag/js?id=' + GA_ID);
    gtag('js', new Date());
    gtag('config', GA_ID);
    // Google Preferred Sources button (footer)
    addScript('https://news.google.com/swg/js/v1/publisher.js', { 'preferred-sources-control': 'manual' });
    addScript('/assets/preferred-source.js');
  }

  /* Withdrawal: stop measurement and remove the analytics cookies already set. */
  function clearAnalyticsCookies() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^_ga(_|$)/.test(name)) return;
      ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
      });
    });
  }

  function apply(v) {
    gtag('consent', 'update', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
    window.dataLayer.push({ event: v === 'granted' ? 'consent_accepted' : 'consent_declined' });
    if (v === 'granted') loadTags();
    else clearAnalyticsCookies();
  }

  var stored = read();
  if (stored === 'granted') apply('granted');

  /* ---- Banner: non-modal dialog, Accept and Decline styled identically ---- */
  var banner = null;

  function choose(v) {
    var was = stored;
    write(v);
    stored = v;
    if (v !== was) apply(v);
    hide();
  }

  function hide() {
    if (banner) { banner.remove(); banner = null; }
  }

  function btn(label) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.style.cssText =
      'font-family:Archivo,-apple-system,sans-serif;font-size:12px;letter-spacing:0.14em;' +
      'text-transform:uppercase;padding:12px 22px;cursor:pointer;border-radius:0;min-height:44px;min-width:44px;' +
      'background:transparent;color:#F5F4F2;border:1px solid #F5F4F2;';
    b.onmouseenter = function () { b.style.background = '#F5F4F2'; b.style.color = '#111110'; };
    b.onmouseleave = function () { b.style.background = 'transparent'; b.style.color = '#F5F4F2'; };
    return b;
  }

  function show() {
    if (banner) { banner.focus(); return; }
    banner = document.createElement('div');
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'consent-title');
    banner.setAttribute('aria-describedby', 'consent-text');
    banner.tabIndex = -1;
    banner.style.cssText =
      'position:fixed;bottom:20px;left:20px;right:20px;max-width:440px;z-index:99990;outline:none;' +
      'background:#111110;color:#F5F4F2;padding:26px 28px;box-shadow:0 8px 32px rgba(0,0,0,0.35);' +
      'font-family:Archivo,-apple-system,sans-serif;';

    var h = document.createElement('div');
    h.id = 'consent-title';
    h.textContent = 'cookies';
    h.style.cssText = 'font-weight:800;font-size:22px;letter-spacing:-0.03em;text-transform:lowercase;margin-bottom:10px;';

    var p = document.createElement('p');
    p.id = 'consent-text';
    p.style.cssText = 'font-size:13px;line-height:1.6;color:#A3A29C;margin:0 0 18px;';
    p.appendChild(document.createTextNode('With your consent we use Google Analytics to see how the site is used, and show Google’s “preferred source” button. Nothing is loaded unless you accept. '));
    var a = document.createElement('a');
    a.href = '/cookie-policy/';
    a.textContent = 'Cookie policy';
    a.style.cssText = 'color:#F5F4F2;text-decoration:underline;';
    p.appendChild(a);

    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap;';
    var accept = btn('Accept');
    var decline = btn('Decline');
    accept.onclick = function () { choose('granted'); };
    decline.onclick = function () { choose('denied'); };
    row.appendChild(accept);
    row.appendChild(decline);

    banner.appendChild(h);
    banner.appendChild(p);
    banner.appendChild(row);
    document.body.appendChild(banner);
    // Focus the dialog itself (announced by screen readers) rather than pre-selecting either answer.
    banner.focus({ preventScroll: true });
  }

  if (stored === null) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
    else show();
  }

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest && e.target.closest('[data-consent-open]');
    if (t) { e.preventDefault(); show(); }
  });

  window.__bellishConsent = {
    open: show,
    status: function () { return stored; }
  };
})();
