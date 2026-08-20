(function(){
  // Google Analytics — one loader here means no page has to include it directly.
  var gaLoader = document.createElement('script');
  gaLoader.src = '/assets/js/analytics.js';
  document.head.appendChild(gaLoader);

  // AdSense — only pushes into ad slots that actually have a rendered width,
  // avoiding "No slot size for availableWidth=0" when .ad-rail is display:none
  // (below the 1100px breakpoint where the sidebar rail is hidden).
  var adsLoader = document.createElement('script');
  adsLoader.src = '/assets/js/ads.js';
  document.head.appendChild(adsLoader);

  var SECTIONS = [
    {label:'tools',  href:'/tools/'},
    {label:'guides', href:'/guides/'},
    {label:'errors', href:'/errors/'},
    {label:'blog',   href:'/blog/'},
    {label:'about',  href:'/about/'}
  ];

  function isActive(path, href){
    if (href === '/') return path === '/' || path === '/index.html';
    return path.indexOf(href) === 0;
  }

  function buildHeader(){
    var path = window.location.pathname;
    var navHtml = SECTIONS.map(function(s){
      var cls = isActive(path, s.href) ? ' class="active"' : '';
      return '<a href="' + s.href + '"' + cls + '>' + s.label + '</a>';
    }).join('');

    return (
      '<div class="titlebar">' +
        '<div class="dots"><span></span><span></span><span></span></div>' +
        '<a class="filename" href="/"><b>DevFixTools</b></a>' +
        '<nav class="primary-nav">' + navHtml + '</nav>' +
        '<div class="grepbar">' +
          '<span class="prompt">grep -i</span>' +
          '<input type="text" id="siteSearch" placeholder="json, jwt, base64, git rebase…" autocomplete="off">' +
          '<span class="cursor"></span>' +
          '<div class="search-results hidden" id="siteSearchResults"></div>' +
        '</div>' +
      '</div>'
    );
  }

  function buildFooter(){
    return (
      '<footer class="site-footer">' +
        '<span>DevFixTools &mdash; free, client-side developer tools &amp; troubleshooting guides</span>' +
        '<span class="foot-links">' +
          '<a href="/about/">about</a>' +
          '<a href="/contact/">contact</a>' +
          '<a href="/privacy/">privacy</a>' +
          '<a href="/terms/">terms</a>' +
          '<a href="/cookie-policy/">cookies</a>' +
        '</span>' +
      '</footer>'
    );
  }

  function mount(id, html){
    var el = document.getElementById(id);
    if (el) el.outerHTML = html;
  }

  mount('site-header', buildHeader());
  mount('site-footer', buildFooter());

  // ---- sitewide search dropdown (uses SITE_INDEX from site-search.js) ----
  var input = document.getElementById('siteSearch');
  var results = document.getElementById('siteSearchResults');
  if (input && results && window.SITE_INDEX){
    var activeIdx = -1;
    var currentMatches = [];

    function render(term){
      if (!term){
        results.classList.add('hidden');
        results.innerHTML = '';
        activeIdx = -1;
        return;
      }
      var t = term.toLowerCase();
      currentMatches = window.SITE_INDEX.filter(function(item){
        return (item.title + ' ' + item.keywords + ' ' + item.category).toLowerCase().indexOf(t) !== -1;
      }).slice(0, 8);

      if (!currentMatches.length){
        results.innerHTML = '<div class="r-empty">no matches for "' + term + '"</div>';
      } else {
        results.innerHTML = currentMatches.map(function(item, i){
          return '<a href="' + item.url + '" data-idx="' + i + '"><span class="r-cat">' + item.category + '</span><span>' + item.title + '</span></a>';
        }).join('');
      }
      activeIdx = -1;
      results.classList.remove('hidden');
    }

    input.addEventListener('input', function(){ render(input.value.trim()); });
    input.addEventListener('focus', function(){ if (input.value.trim()) render(input.value.trim()); });

    input.addEventListener('keydown', function(e){
      var links = results.querySelectorAll('a');
      if (!links.length) return;
      if (e.key === 'ArrowDown'){
        e.preventDefault();
        activeIdx = Math.min(activeIdx + 1, links.length - 1);
      } else if (e.key === 'ArrowUp'){
        e.preventDefault();
        activeIdx = Math.max(activeIdx - 1, 0);
      } else if (e.key === 'Enter'){
        if (activeIdx >= 0 && links[activeIdx]){
          window.location.href = links[activeIdx].getAttribute('href');
        }
        return;
      } else {
        return;
      }
      links.forEach(function(l, i){ l.classList.toggle('active-result', i === activeIdx); });
    });

    document.addEventListener('click', function(e){
      if (e.target !== input && !results.contains(e.target)){
        results.classList.add('hidden');
      }
    });

    document.addEventListener('keydown', function(e){
      if (e.key === '/' && document.activeElement !== input){
        e.preventDefault();
        input.focus();
      }
    });
  }
})();
