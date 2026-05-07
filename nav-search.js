(function() {
  var PREFIX = '../';
  var PAGES = [
    'kap1/index.html',
    'kap1/cia-triaden.html',
    'kap1/kjerneprinsipper.html',
    'kap1/trusselbilde.html',
    'kap2/index.html',
    'kap2/injection.html',
    'kap2/xss-csrf.html',
    'kap2/authn-autorisasjonsfeil.html',
    'kap2/konfig-krypto-ssrf.html',
    'kap3/index.html',
    'kap3/symmetrisk-krypto.html',
    'kap3/asymmetrisk-krypto.html',
    'kap3/hashing-mac.html',
    'kap4/index.html',
    'kap4/autentisering.html',
    'kap4/jwt.html',
    'kap4/multi-level.html',
    'kap4/tilgangskontroll.html',
    'kap4/kontrollhijacking.html',
    'kap5/index.html',
    'kap5/metodikk.html',
    'kap5/stride.html',
    'kap6/index.html',
    'kap6/risikohåndtering.html',
    'kap6/sdl.html',
    'kap6/sikkerhetstesting.html',
    'kap7/index.html',
    'kap7/llm-angrep.html',
    'kap7/llm-forsvar.html',
    'kap8/index.html',
    'kap8/mikrotjenester.html',
    'kap8/supply-chain.html',
    'kap9/index.html',
    'kap9/gdpr.html',
    'kap9/privacy-engineering.html',
    'kap10/index.html',
    'kap10/sast.html',
    'kap10/ai-sikkerhet.html',
  ];

  var input = document.getElementById('nav-search');
  var resultsEl = document.getElementById('nav-search-results');
  if (!input || !resultsEl) return;

  var active = -1, items = [], debounceTimer, fuse = null;

  function buildIndex() {
    return Promise.all(PAGES.map(function(page) {
      return fetch(PREFIX + page).then(function(r){return r.text();}).then(function(html){
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var mainEl = doc.querySelector('main');
        var chapter = mainEl ? (mainEl.dataset.chapter || '') : '';
        var h1 = doc.querySelector('h1');
        var pageTitle = h1 ? h1.textContent.trim() : '';
        var entries = [];
        var sections = doc.querySelectorAll('section[id]');
        if (sections.length) {
          sections.forEach(function(sec){
            var h2 = sec.querySelector('h2');
            entries.push({
              title: h2 ? h2.textContent.trim() : pageTitle,
              chapter: chapter, url: PREFIX + page + '#' + sec.id,
              body: sec.textContent.replace(/\s+/g,' ').trim()
            });
          });
        } else {
          entries.push({ title: pageTitle, chapter: chapter, url: PREFIX + page,
            body: (mainEl || doc.body).textContent.replace(/\s+/g,' ').trim() });
        }
        return entries;
      }).catch(function(){ return []; });
    })).then(function(arrays){ var idx=[]; arrays.forEach(function(a){idx=idx.concat(a);}); return idx; });
  }

  function ensureFuse(cb) {
    if (window.Fuse) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  ensureFuse(function() {
    buildIndex().then(function(searchIndex){
      fuse = new Fuse(searchIndex, {
        keys: [{name:'title',weight:0.45},{name:'body',weight:0.45},{name:'chapter',weight:0.1}],
        threshold: 0.3, ignoreLocation: true, includeMatches: true, minMatchCharLength: 2
      });
      input.placeholder = 'Søk i alle kapitler…';
      input.disabled = false;
    });
  });

  function snippet(body,q,max){
    var words=q.trim().split(/\s+/).filter(function(w){return w.length>1;});
    if (words.length){
      var re=new RegExp(words.map(function(w){return w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}).join('|'),'i');
      var m=re.exec(body);
      if (m){ var s=Math.max(0,m.index-60), e=Math.min(body.length,m.index+m[0].length+max-60); var str=body.substring(s,e); if (s>0) str='…'+str; if (e<body.length) str+='…'; return str; }
    }
    return body.length>max ? body.substring(0,max)+'…' : body;
  }
  function highlight(t,q){
    var words=q.trim().split(/\s+/).filter(function(w){return w.length>1;}); if(!words.length) return t;
    var re=new RegExp('('+words.map(function(w){return w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}).join('|')+')','gi');
    return t.replace(re,'<mark>$1</mark>');
  }
  function render(hits,q){
    active=-1;
    if (!hits.length){ resultsEl.innerHTML='<div class="nav-sr-empty">Ingen treff for «'+q+'»</div>'; resultsEl.classList.add('active'); items=[]; return; }
    var html=''; var max=Math.min(hits.length,8);
    for(var i=0;i<max;i++){
      var it=hits[i].item;
      html+='<a class="nav-sr-item" href="'+it.url+'"><div class="nav-sr-chapter">'+it.chapter+'</div><div class="nav-sr-title">'+highlight(it.title,q)+'</div><div class="nav-sr-body">'+highlight(snippet(it.body,q,120),q)+'</div></a>';
    }
    resultsEl.innerHTML=html; resultsEl.classList.add('active'); items=resultsEl.querySelectorAll('.nav-sr-item');
  }
  function close(){ resultsEl.classList.remove('active'); resultsEl.innerHTML=''; items=[]; active=-1; }
  function setActive(i){ for(var j=0;j<items.length;j++) items[j].classList.remove('nav-sr-active'); if(i>=0&&i<items.length){ items[i].classList.add('nav-sr-active'); items[i].scrollIntoView({block:'nearest'}); } active=i; }

  input.addEventListener('input', function(){
    clearTimeout(debounceTimer); var q=input.value.trim();
    if (!fuse || q.length<2){ close(); return; }
    debounceTimer=setTimeout(function(){ render(fuse.search(q),q); },150);
  });
  input.addEventListener('keydown', function(e){
    if (!resultsEl.classList.contains('active') || !items.length) return;
    if (e.key==='ArrowDown'){ e.preventDefault(); setActive(active<items.length-1?active+1:0); }
    else if (e.key==='ArrowUp'){ e.preventDefault(); setActive(active>0?active-1:items.length-1); }
    else if (e.key==='Enter' && active>=0){ e.preventDefault(); items[active].click(); }
    else if (e.key==='Escape'){ close(); input.blur(); }
  });
  document.addEventListener('click', function(e){ if (!resultsEl.contains(e.target) && e.target!==input) close(); });
})();
