/* Bellish Architects — site events for Google Analytics 4 (PLAN.md 4.1).
   Everything goes through window.__bellishConsent.track(), which sends nothing without consent.
   No personal data: only what was clicked or sent, never names, emails, phone numbers or message text.
   Forms, the gallery and the projects grid report their own events (FormScript, lightbox.js, projects page). */
(function () {
  if (window.__bellishTrack) return;
  window.__bellishTrack = true;

  function track(name, params) {
    var c = window.__bellishConsent;
    if (c && c.track) c.track(name, params);
  }
  function granted() {
    var c = window.__bellishConsent;
    return !!(c && c.status() === 'granted');
  }
  /* Page-level events: right away if consent was already given, otherwise once the visitor accepts. */
  function whenGranted(fn) {
    if (granted()) return fn();
    document.addEventListener('bellish-consent', function h(e) {
      if (e.detail !== 'granted') return;
      document.removeEventListener('bellish-consent', h);
      fn();
    });
  }
  /* Where on the site a link was clicked: 'footer', or the page ('home', 'contact', 'career', ...). */
  function where(el) {
    if (el.closest('footer')) return 'footer';
    return location.pathname.split('/')[1] || 'home';
  }

  // ---- Clicks: contact channels (key events), directions, Instagram, next project, roles, Preferred Sources
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest && e.target.closest('a, button');
    if (!t) return;
    var href = t.getAttribute('href') || '';
    if (/^https:\/\/wa\.me\//.test(href)) track('contact_click', { contact_method: 'whatsapp', link_location: where(t) });
    else if (/^tel:/.test(href)) track('contact_click', { contact_method: 'phone', link_location: where(t) });
    else if (/^mailto:/.test(href)) track('contact_click', { contact_method: 'email', link_location: where(t) });
    else if (/google\.com\/maps/.test(href)) track('directions_click', { office: t.getAttribute('data-location') || '' });
    else if (/instagram\.com/.test(href)) track('social_click', { link_url: href, link_location: where(t) });
    else if (t.classList.contains('role')) track('role_click', { position: t.getAttribute('data-position') || '' });
    else if (t.id === 'gps-btn') track('preferred_sources_click', { link_location: where(t) });
    else if (t.hasAttribute('data-next-project')) track('next_project', { project_name: t.getAttribute('data-next-project'), link_url: href });
  }, true);

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    // ---- Project pages: which project, type, status and region
    var main = document.querySelector('main[data-project]');
    if (main) {
      whenGranted(function () {
        track('view_project', {
          project_name: main.getAttribute('data-project'),
          project_type: main.getAttribute('data-project-type'),
          project_status: main.getAttribute('data-project-status'),
          project_region: main.getAttribute('data-project-region'),
        });
      });
    }

    // ---- 404: the address that was not found, and where the visitor came from
    if (document.body.getAttribute('data-page') === '404') {
      whenGranted(function () {
        track('page_not_found', { missing_path: location.pathname, page_referrer: document.referrer || '(direct)' });
      });
    }

    // ---- Scroll depth on project pages and the studio page: 25 / 50 / 75 / 100%, once each
    if (main || location.pathname === '/studio/') {
      var marks = [25, 50, 75, 100], sent = {}, queued = false;
      var check = function () {
        queued = false;
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var pct = h <= 0 ? 100 : Math.round((window.scrollY / h) * 100);
        marks.forEach(function (m) {
          if (pct >= m && !sent[m] && granted()) {
            sent[m] = true;
            track('scroll_depth', { percent_scrolled: m, project_name: main ? main.getAttribute('data-project') : 'studio' });
          }
        });
      };
      window.addEventListener('scroll', function () {
        if (!queued) { queued = true; requestAnimationFrame(check); }
      }, { passive: true });
    }
  });
})();
