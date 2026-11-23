/* Freckles Beauty Clinic — cookie consent
   Google Analytics (GA4) is NOT loaded until the visitor accepts. */
(function () {
  var GA_ID = 'G-WGTWPR57BD';
  var KEY = 'freckles_cookie_consent';
  var gaLoaded = false;

  function read() {
    try { var v = JSON.parse(localStorage.getItem(KEY) || 'null'); return v && v.choice; } catch (e) { return null; }
  }
  function save(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ choice: choice, ts: Date.now() })); } catch (e) {}
  }
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    window['ga-disable-' + GA_ID] = false;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  function clearGA() {
    window['ga-disable-' + GA_ID] = true;
    var host = location.hostname.split('.');
    var domains = ['', location.hostname, '.' + location.hostname];
    if (host.length > 2) domains.push('.' + host.slice(-3).join('.'));
    domains.push('.' + host.slice(-2).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid') {
        domains.forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  var banner;
  function hide() { if (banner) { banner.remove(); banner = null; } }
  function choose(choice) {
    save(choice);
    if (choice === 'granted') loadGA(); else clearGA();
    hide();
  }
  function show() {
    hide();
    banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cb-title');
    banner.innerHTML =
      '<div class="cb-text"><strong id="cb-title">Cookies</strong>' +
      '<p>We use analytics cookies (Google Analytics) to understand how our website is used and to improve it. ' +
      'They are only switched on if you accept. <a href="/cookie-policy">Cookie Policy</a></p></div>' +
      '<div class="cb-actions">' +
      '<button type="button" class="cb-btn cb-decline">Decline</button>' +
      '<button type="button" class="cb-btn cb-accept">Accept</button></div>';
    document.body.appendChild(banner);
    banner.querySelector('.cb-accept').addEventListener('click', function () { choose('granted'); });
    banner.querySelector('.cb-decline').addEventListener('click', function () { choose('denied'); });
  }

  function init() {
    var c = read();
    if (c === 'granted') loadGA();
    else if (c === 'denied') window['ga-disable-' + GA_ID] = true;
    else { window['ga-disable-' + GA_ID] = true; show(); }
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-cookie-settings]');
      if (t) { e.preventDefault(); show(); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
