// Preview-only navigation: maps live-site absolute paths to local .dc.html files.
// Does nothing on bellish.co.il.
(function () {
  if (location.hostname.indexOf('bellish.co.il') > -1) return;
  var MAP = {
    '/': 'Home.dc.html',
    '/projects/': 'Projects.dc.html',
    '/studio/': 'Studio.dc.html',
    '/career/': 'Career.dc.html',
    '/contact/': 'Contact.dc.html',
    '/cookie-policy/': 'CookiePolicy.dc.html',
    '/accessibility/': 'Accessibility.dc.html'
  };
  function localHref(href) {
    var hash = '';
    var i = href.indexOf('#');
    if (i > -1) { hash = href.slice(i); href = href.slice(0, i); }
    var path = href.split('?')[0];
    if (MAP[path]) return MAP[path] + hash;
    if (path === '/project/') return 'Project.dc.html' + hash;
    var m = path.match(/^\/project\/([^\/]+)\/?$/);
    if (m) return 'Project.dc.html?p=' + m[1] + hash;
    return null;
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href^="/"]');
    if (!a) return;
    var target = localHref(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    e.stopPropagation();
    location.href = target;
  }, true);
})();
