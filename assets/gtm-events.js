/* Bellish Architects — comprehensive GTM measurement (GTM-T3H6PWPH).
   Everything below is pushed to window.dataLayer. Build GTM triggers as
   "Custom Event" on the `event` names, and read the extra keys as
   Data Layer Variables. Events emitted:

     page_engagement  action:"page_view"                       (every load)
     scroll_depth     percent:25|50|75|100                     (once each per page)
     contact_click    method:"phone"|"email"|"whatsapp", value (tel/mailto/wa.me)
     social_click     network:"instagram"|"whatsapp"|...       (social profiles)
     outbound_click   link_url, link_domain                    (external sites)
     nav_click        button_text, link_url                    (in-site navigation)
     project_click    button_text, link_url                    (opening a project)
     cta_click        button_text                              (primary lowercase CTAs)
     button_click     button_text, button_type                 (anything else clickable)
     form_start       form_name                                (first field focus)
     form_submit      form_name                                (submit)
     form_error       form_name, message                       (validation message shown)
     page_exit        engagement_seconds                       (on leave)
*/
(function () {
  if (window.__bellishTracking) return; // guard against double init
  window.__bellishTracking = true;
  window.dataLayer = window.dataLayer || [];
  var DL = window.dataLayer;
  function push(o) { DL.push(o); }

  var SITE_HOST = location.hostname;
  var startTime = Date.now();

  function clean(t) { return (t || '').replace(/\s+/g, ' ').trim().slice(0, 100); }

  /* ---- 1. Page view (with useful context) ---- */
  push({
    event: 'page_engagement',
    action: 'page_view',
    page_path: location.pathname,
    page_title: document.title,
    referrer: document.referrer || '(direct)'
  });

  /* ---- 2. Click classification ---- */
  document.addEventListener('click', function (e) {
    // Gallery / lightbox image clicks
    var gimg = e.target && e.target.closest && e.target.closest('img.zoomable, .gallery img, img[data-gallery]');
    if (gimg) {
      var gsrc = gimg.currentSrc || gimg.src || '';
      push({
        event: 'gallery_image_click',
        image_name: gsrc.split('/').pop().split('?')[0],
        image_url: gsrc,
        page_path: location.pathname + location.search
      });
      // not an a/button — fall through, el below will be null
    }

    var el = e.target && e.target.closest && e.target.closest('a, button, [role="button"]');
    if (!el) return;

    var isLink = el.tagName === 'A';
    var href = isLink ? (el.getAttribute('href') || '') : '';
    var absUrl = isLink ? (el.href || '') : '';
    var text = clean(el.getAttribute('aria-label') || el.textContent) || '(no text)';

    // Contact intents (highest value)
    if (/^tel:/i.test(href)) {
      return push({ event: 'contact_click', method: 'phone', value: href.replace(/^tel:/i, ''), page_path: location.pathname });
    }
    if (/^mailto:/i.test(href)) {
      return push({ event: 'contact_click', method: 'email', value: href.replace(/^mailto:/i, '').split('?')[0], page_path: location.pathname });
    }
    if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) {
      push({ event: 'contact_click', method: 'whatsapp', value: absUrl, page_path: location.pathname });
      push({ event: 'social_click', network: 'whatsapp', link_url: absUrl, page_path: location.pathname });
      return;
    }

    // Map / directions clicks
    if (/google\.[a-z.]+\/maps|maps\.google|maps\.app\.goo\.gl|goo\.gl\/maps|waze\.com|\bmaps\?/i.test(absUrl)) {
      return push({ event: 'map_click', location: clean(el.getAttribute('data-location') || text), link_url: absUrl, page_path: location.pathname });
    }

    if (isLink && absUrl) {
      var domain = '';
      try { domain = new URL(absUrl).hostname; } catch (err) {}
      var social = domain.match(/instagram|facebook|linkedin|youtube|pinterest|behance|twitter|x\.com|tiktok/i);
      if (social) {
        return push({ event: 'social_click', network: social[0].toLowerCase().replace('.com', ''), link_url: absUrl, page_path: location.pathname });
      }
      var external = domain && domain !== SITE_HOST && !/^javascript:|^#/.test(href);
      if (external) {
        return push({ event: 'outbound_click', button_text: text, link_url: absUrl, link_domain: domain, page_path: location.pathname });
      }
      // Internal navigation to a project page
      if (/project/i.test(href)) {
        return push({ event: 'project_click', button_text: text, link_url: absUrl, page_path: location.pathname });
      }
      // Other in-site navigation
      if (href && !/^#/.test(href)) {
        return push({ event: 'nav_click', button_text: text, link_url: absUrl, page_path: location.pathname });
      }
    }

    // Primary lowercase CTAs (design uses heavy weight lowercase buttons)
    if (/^(start a project|get in touch|view (all )?projects?|apply|send|explore|contact)/i.test(text)) {
      return push({ event: 'cta_click', button_text: text, page_path: location.pathname });
    }

    // Fallback: any other button / clickable
    push({ event: 'button_click', button_text: text, button_type: isLink ? 'link' : 'button', link_url: absUrl, page_path: location.pathname });
  }, true);

  /* ---- 3. Scroll depth (25/50/75/100), each fired once ---- */
  var marks = [25, 50, 75, 100], fired = {};
  function onScroll() {
    var doc = document.documentElement, body = document.body;
    var scrollTop = window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
    var height = Math.max(body.scrollHeight, doc.scrollHeight) - window.innerHeight;
    if (height <= 0) return;
    var pct = Math.min(100, Math.round((scrollTop / height) * 100));
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i];
      if (pct >= m && !fired[m]) {
        fired[m] = 1;
        push({ event: 'scroll_depth', percent: m, page_path: location.pathname });
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', onScroll);

  /* ---- 4. Form engagement (start / submit / error) ---- */
  var formStarted = {};
  function formName(form) { return (form && (form.getAttribute('name') || form.getAttribute('data-form'))) || 'contact'; }

  document.addEventListener('focusin', function (e) {
    var field = e.target;
    if (!field || !/INPUT|TEXTAREA|SELECT/.test(field.tagName)) return;
    var form = field.closest('form');
    if (!form) return;
    var name = formName(form);
    if (formStarted[name]) return;
    formStarted[name] = 1;
    push({ event: 'form_start', form_name: name, page_path: location.pathname });
  }, true);

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || form.tagName !== 'FORM') return;
    push({ event: 'form_submit', form_name: formName(form), page_path: location.pathname });
  }, true);

  // Watch for a validation error message appearing (design shows errors in red).
  if (window.MutationObserver) {
    var errObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mu) {
        var t = clean(mu.target && mu.target.textContent);
        if (!t) return;
        // Contact form error copy tends to include these words.
        if (/required|valid|please|error|missing|fill/i.test(t) && t.length < 120) {
          push({ event: 'form_error', form_name: 'contact', message: t, page_path: location.pathname });
        }
      });
    });
    window.addEventListener('load', function () {
      var form = document.querySelector('form');
      if (form) errObserver.observe(form, { childList: true, subtree: true, characterData: true });
    });
  }

  /* ---- 5. Engagement time on exit ---- */
  function sendExit() {
    push({ event: 'page_exit', engagement_seconds: Math.round((Date.now() - startTime) / 1000), page_path: location.pathname });
  }
  window.addEventListener('pagehide', sendExit);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') sendExit();
  });
})();
