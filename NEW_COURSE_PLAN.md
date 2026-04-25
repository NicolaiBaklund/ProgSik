# Build plan — editorial course site (self-contained)

You are a coding agent tasked with building a static course website in the editorial "paper + rust" style. This document contains everything you need: the architecture, the full CSS, canonical HTML skeletons, all shared scripts, and contracts for the AI study assistant. You do **not** need access to any reference repo.

---

## 1. Inputs you will receive

- **Lecture slides** (PDFs or `.pptx`) — source of truth for what to teach.
- **The course book** (PDF) — background corpus for the in-page AI assistant (RAG).
- **Course code + title** — e.g. "TDT4120 — Algoritmer og datastrukturer".
- Optionally: semester label, course language (default Norwegian bokmål).

Store the raw inputs in a `powerpoints/` and `book/` folder at the repo root. They are not shipped to the user; they're references.

---

## 2. What you are building

A static website with:

1. **Landing page** (`index.html`) — hero, full-site search, chapter grid, info blocks, footer.
2. **Per-chapter hub** (`kapN/index.html`) — hero, in-page TOC, overview section with one editorial SVG figure, subpage cards, quiz bank.
3. **Subpages** (`kapN/<slug>.html`) — deep-dive pages with 3–8 `<section id>` blocks, inline SVG figures, callouts, code blocks.
4. **Global site search** — fuse.js client-side index over every chapter and subpage.
5. **AI study assistant** — floating chat button on every page. Reads the user's page context, retrieves relevant passages from the course book, streams a reply.
6. **Quiz reveal** — click-to-reveal answers on chapter pages.
7. (Optional) **Language mirror** under `/en/`.

**Stack:** static HTML + vanilla JS + one serverless function on Vercel. No build step. No framework. Two external deps: fuse.js from CDN, OpenRouter for embeddings + chat.

---

## 3. Voice and authoring rules

Before writing content, internalize these. They are the difference between a generic slide-dump and a site that feels authored.

- **Second-person, explanatory, slightly literary.** "Tenk deg at…", "I dette kapittelet ser vi på…". Short paragraphs. Italic for emphasis; bold sparingly.
- **Analogies first, formalism second.** Introduce TCP as a telephone call *before* showing the segment layout.
- **Callouts punctuate — one per section at most.** Green for the chapter's core insight, blue for asides, yellow for warnings. Never stack two in a row.
- **Figures are hand-drawn-feeling inline SVGs.** Redraw the concept from the slide; do **not** screenshot slides. Label with `IBM Plex Sans` for boxes and `Newsreader` italic for prose labels. Use rust (`#b04428`), blue (`#2d4a7a`), and green (`#3d6b3a`) strokes. Dashed lines for clouds/abstract boundaries.
- **Code blocks are terse and real.** Actual protocol syntax / library calls — not pseudocode. Dark background (`#1a1612`) with paper-colored text.
- **No AI hedging.** "kan være" is fine; "det er viktig å merke seg at" is not. No word-count postscripts. No "let me explain…" preambles.
- **H1 uses the italic-second-word pattern:** `<h1>Applikasjons<em>laget</em></h1>`. Apply this on every hero.

Default language: **Norwegian bokmål**. English goes under `/en/` as a mirror.

---

## 4. Content planning (gate before coding)

Before writing a single HTML file, produce `CONTENT_PLAN.md` at the repo root:

1. List the book's chapters. Group the lecture slide files by chapter — the slide filenames usually already do this (e.g. `2 - Chapter_3 - UDP`, `3 - Chapter_3 - Congestion Control`). Mirror that grouping.
2. For each chapter, decide subpage split: one subpage per cohesive subtopic, 2–4 subpages per chapter, each fits ~400–800 lines of HTML (~15–25 min reading).
3. For each subpage, list 3–8 sections with a 1-line synopsis and any planned figures.
4. For each chapter, draft 15–25 quiz items tagged **Lett / Middels / Vanskelig**.

**Stop here. Show `CONTENT_PLAN.md` to the user and wait for sign-off before building.** This is the cheapest moment to catch a wrong split.

---

## 5. Repository layout

```
<repo-root>/
├── index.html                 # Landing page
├── style.css                  # §9 — paste verbatim
├── quiz.js                    # §10 — paste verbatim
├── nav-search.js              # §11 — paste verbatim, edit PAGES
├── chat-widget.js             # §13 — reference impl
├── lang-switch.js             # §12 — only if doing i18n
├── vercel.json                # §16
├── package.json               # §16
├── api/
│   └── chat.js                # §14 — reference impl
├── public/
│   └── chunks.json            # §15 — generated from the book
├── kap1/
│   ├── index.html             # Chapter hub
│   └── <slug>.html …          # Deep-dive pages
├── kap2/ … kapN/
├── tools/
│   └── build_chunks.py        # §15 — one-shot book embedding
├── pensum.md                  # Curriculum overview (plain prose)
├── course_description.md
├── README.md
├── powerpoints/               # raw slides (not shipped)
└── book/                      # raw book PDF (not shipped)
```

Chapter and subpage slugs: lowercase, Norwegian, kebab-case. Keep them stable — search indexes by URL.

---

## 6. Build order (top-down)

1. **Inventory** — confirm course code, title, semester. List slide files and group by chapter. Read book TOC.
2. **Plan** — write `CONTENT_PLAN.md` and get sign-off (§4).
3. **Scaffold** — paste `style.css`, `quiz.js`, `nav-search.js`, `vercel.json`, `package.json`. Create empty `kapN/` folders. Write `index.html` from the skeleton in §7.1.
4. **One chapter end-to-end** — build Chapter 1 completely: hub + all subpages + quiz. This is the template for the rest. Show the user.
5. **Fan out** — apply the template to chapters 2..N. Keep figure motifs consistent (don't invent a new SVG style per chapter).
6. **RAG** — chunk and embed the book (§15), write `public/chunks.json`, wire `api/chat.js` (§14), add `chat-widget.js` on every page.
7. **Deploy** — push to GitHub, import to Vercel, set `OPENROUTER_API_KEY`. Verify chat + search + quiz in production.
8. **Sweep** — broken anchors, mobile layout (375px, 768px), "contribute" GitHub link, update `README.md`.
9. *(Optional)* **i18n mirror** under `/en/` with `lang-switch.js`.

---

## 7. Canonical HTML skeletons

Adapt these verbatim. The class names are wired to the CSS in §9 — don't rename them.

### 7.1 Landing page (`index.html`)

```html
<!DOCTYPE html>
<html lang="no">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>COURSE_CODE — COURSE_TITLE</title>
<link rel="stylesheet" href="style.css">
<style>
.index-hero { padding: 120px 0 80px; position: relative; z-index: 10; }
.index-hero .course-code {
  font-family: var(--mono); font-size: 13px; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--rust); margin-bottom: 20px;
  display: inline-block; padding: 6px 14px; border: 1px solid var(--rust); border-radius: 2px;
}
.index-hero h1 {
  font-size: clamp(48px, 8vw, 96px); font-weight: 500; line-height: 1.0;
  letter-spacing: -0.03em; margin-bottom: 32px;
}
.index-hero .lead {
  font-size: 22px; font-style: italic; color: var(--ink-soft);
  max-width: 600px; line-height: 1.5;
}
.chapter-grid { padding: 60px 0 80px; }
.chapter-grid .section-label {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--ink-ghost);
  margin-bottom: 32px; padding-bottom: 16px; border-bottom: 1px solid var(--line);
}
.chapter-card {
  display: grid; grid-template-columns: 60px 1fr auto; align-items: baseline; gap: 24px;
  padding: 24px 0; border-bottom: 1px solid var(--line-soft);
  text-decoration: none; color: inherit; transition: background 0.15s;
}
.chapter-card:first-child { border-top: 1px solid var(--line-soft); }
.chapter-card:hover {
  background: var(--paper-dark);
  padding-left: 16px; padding-right: 16px; margin-left: -16px; margin-right: -16px;
  border-radius: 4px;
}
.chapter-card .ch-num { font-family: var(--mono); font-size: 14px; color: var(--rust); font-weight: 500; }
.chapter-card .ch-title {
  font-family: var(--serif); font-size: 22px; font-weight: 500; line-height: 1.25;
  margin-bottom: 4px; letter-spacing: -0.01em;
}
.chapter-card .ch-desc { font-size: 15px; color: var(--ink-faded); font-style: italic; line-height: 1.45; }
.chapter-card .ch-arrow { font-family: var(--mono); font-size: 18px; color: var(--ink-ghost); }
.chapter-card:hover .ch-arrow { color: var(--rust); transform: translateX(4px); }

/* search */
.search-wrapper { position: relative; max-width: 540px; margin-top: 36px; z-index: 100; }
#site-search {
  width: 100%; font-family: var(--serif); font-size: 17px;
  padding: 14px 18px 14px 44px;
  border: 1px solid rgba(176,68,40,0.38); border-radius: 4px;
  background: var(--paper); color: var(--ink); outline: none;
  box-shadow: 0 2px 14px rgba(26,22,18,0.07);
}
#site-search:focus { border-color: var(--rust); box-shadow: 0 0 0 3px rgba(176,68,40,0.16); }
.search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #8a8073; pointer-events: none; }
#search-results {
  display: none; position: absolute; top: calc(100% + 6px); left: 0; right: 0;
  background: var(--paper); border: 1px solid var(--line); border-radius: 4px;
  box-shadow: 0 8px 24px rgba(26,22,18,0.12); max-height: 420px; overflow-y: auto; z-index: 100;
}
#search-results.active { display: block; }
.sr-item { display: block; padding: 14px 18px; text-decoration: none; color: inherit; border-bottom: 1px solid var(--line-soft); }
.sr-item:hover, .sr-item.sr-active { background: var(--paper-dark); }
.sr-chapter { font-family: var(--mono); font-size: 11px; color: var(--rust); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2px; }
.sr-title { font-family: var(--serif); font-size: 16px; font-weight: 500; margin-bottom: 4px; }
.sr-body { font-size: 13px; color: var(--ink-faded); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.sr-body mark { background: rgba(176,68,40,0.15); color: var(--rust); padding: 0 2px; border-radius: 2px; }
.info-section { padding: 60px 0 100px; border-top: 1px solid var(--line); }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.info-block h3 { font-family: var(--sans); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: var(--rust); margin: 0 0 16px; }
.info-block p, .info-block li { font-size: 15px; color: var(--ink-faded); line-height: 1.6; }
.info-block ul { list-style: none; margin: 0; padding: 0; }
.info-block li { padding: 6px 0; border-bottom: 1px dotted var(--line-soft); }
@media (max-width: 768px) {
  .index-hero { padding: 80px 0 60px; }
  .chapter-card { grid-template-columns: 40px 1fr auto; gap: 16px; }
  .chapter-card .ch-title { font-size: 18px; }
  .info-grid { grid-template-columns: 1fr; gap: 32px; }
}
</style>
</head>
<body>
<header class="index-hero">
  <div class="container">
    <div class="course-code">COURSE_CODE · SEMESTER</div>
    <h1>First line<br><em>italic second line</em></h1>
    <p class="lead">One-sentence lede — what this site is.</p>
    <div class="search-wrapper">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" id="site-search" placeholder="Søk i alle kapitler…" autocomplete="off">
      <div id="search-results"></div>
    </div>
  </div>
</header>

<main class="chapter-grid" data-chapter="Forsiden">
  <div class="container">
    <div class="section-label">Kapitler</div>
    <div class="chapters">
      <a href="kap1/" class="chapter-card">
        <span class="ch-num">Kap 1</span>
        <div class="ch-info">
          <div class="ch-title">Chapter 1 title</div>
          <div class="ch-desc">One-line description of chapter 1</div>
        </div>
        <span class="ch-arrow">&rarr;</span>
      </a>
      <!-- repeat per chapter -->
    </div>
  </div>
</main>

<section class="info-section">
  <div class="container">
    <div class="info-grid">
      <div class="info-block">
        <h3>Om emnet</h3>
        <p>One paragraph about the course.</p>
      </div>
      <div class="info-block">
        <h3>Pensum</h3>
        <ul>
          <li>Kapittel 1 — Title</li>
          <li>Kapittel 2 — Title</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="container">
    <div class="ornament">&#10038; &#10038; &#10038;</div>
    <p>NTNU · COURSE_CODE · SEMESTER</p>
  </div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js"></script>
<script>
// Full-site search — inline on landing page.
(function() {
  var PAGES = [
    // Every searchable page. Keep flat list.
    'kap1/index.html',
    // 'kap2/some-subpage.html', etc.
  ];
  var input = document.getElementById('site-search');
  var resultsEl = document.getElementById('search-results');
  var active = -1, items = [], debounceTimer, fuse = null;
  input.placeholder = 'Laster søkeindeks…';
  input.disabled = true;

  function buildIndex() {
    return Promise.all(PAGES.map(function(page) {
      return fetch(page).then(function(r){return r.text();}).then(function(html){
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
              chapter: chapter, url: page + '#' + sec.id,
              body: sec.textContent.replace(/\s+/g,' ').trim()
            });
          });
        } else {
          entries.push({ title: pageTitle, chapter: chapter, url: page,
            body: (mainEl || doc.body).textContent.replace(/\s+/g,' ').trim() });
        }
        return entries;
      }).catch(function(){ return []; });
    })).then(function(arrays){ var idx=[]; arrays.forEach(function(a){idx=idx.concat(a);}); return idx; });
  }

  buildIndex().then(function(searchIndex){
    fuse = new Fuse(searchIndex, {
      keys: [{name:'title',weight:0.45},{name:'body',weight:0.45},{name:'chapter',weight:0.1}],
      threshold: 0.3, ignoreLocation: true, includeMatches: true, minMatchCharLength: 2
    });
    input.placeholder = 'Søk i alle kapitler…';
    input.disabled = false;
  });

  function snippet(body, q, max) {
    var words = q.trim().split(/\s+/).filter(function(w){return w.length>1;});
    if (words.length) {
      var re = new RegExp(words.map(function(w){return w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}).join('|'),'i');
      var m = re.exec(body);
      if (m) {
        var s = Math.max(0, m.index-60), e = Math.min(body.length, m.index+m[0].length+max-60);
        var str = body.substring(s,e);
        if (s>0) str='…'+str; if (e<body.length) str+='…';
        return str;
      }
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
    if (!hits.length){ resultsEl.innerHTML='<div class="sr-empty">Ingen treff</div>'; resultsEl.classList.add('active'); items=[]; return; }
    var html=''; var max=Math.min(hits.length,8);
    for(var i=0;i<max;i++){
      var it=hits[i].item;
      html+='<a class="sr-item" href="'+it.url+'"><div class="sr-chapter">'+it.chapter+'</div><div class="sr-title">'+highlight(it.title,q)+'</div><div class="sr-body">'+highlight(snippet(it.body,q,150),q)+'</div></a>';
    }
    resultsEl.innerHTML=html; resultsEl.classList.add('active'); items=resultsEl.querySelectorAll('.sr-item');
  }
  function close(){ resultsEl.classList.remove('active'); resultsEl.innerHTML=''; items=[]; active=-1; }
  function setActive(i){ for(var j=0;j<items.length;j++) items[j].classList.remove('sr-active'); if(i>=0&&i<items.length){ items[i].classList.add('sr-active'); items[i].scrollIntoView({block:'nearest'}); } active=i; }
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
</script>
<script src="chat-widget.js"></script>
</body>
</html>
```

### 7.2 Chapter hub (`kapN/index.html`)

```html
<!DOCTYPE html>
<html lang="no">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kapittel N — Title</title>
<link rel="stylesheet" href="../style.css">
</head>
<body>
<nav class="site-nav">
  <div class="container">
    <a href="../" class="brand">COURSE_CODE</a>
    <a href="../" class="nav-back">&larr; Alle kapitler</a>
    <div class="nav-search-wrapper">
      <svg class="nav-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" id="nav-search" placeholder="Laster…" autocomplete="off" disabled>
      <div id="nav-search-results"></div>
    </div>
  </div>
</nav>

<main data-chapter="Kapittel N: Title">
<header class="hero">
  <div class="container">
    <div class="eyebrow">Kapittel N · Area</div>
    <h1>Chapter first<em>word</em></h1>
    <p class="lede">One-sentence lede for the whole chapter.</p>
  </div>
</header>

<nav class="chapter-toc">
  <div class="container">
    <ol class="chapter-toc-list">
      <li><span class="toc-num">01</span><a href="#overblikk">Helhetsbilde</a></li>
      <li><span class="toc-num">02</span><a href="#deler">Deler</a></li>
      <li><span class="toc-num">03</span><a href="#quiz">Test deg selv</a></li>
    </ol>
  </div>
</nav>

<section id="overblikk">
  <div class="container">
    <div class="section-badge">Overblikk</div>
    <h2>Det store <em>bildet</em></h2>
    <p class="section-intro">Italic introductory sentence.</p>
    <p class="lead">Dropcap-first paragraph — the big idea.</p>

    <figure class="fig-frame">
      <svg viewBox="0 0 720 370" xmlns="http://www.w3.org/2000/svg">
        <!-- Editorial SVG here. Labels in IBM Plex Sans / Newsreader italic.
             Stroke colors: #b04428 (rust), #2d4a7a (blue), #3d6b3a (green).
             Dashed lines for abstract boundaries. -->
      </svg>
      <figcaption>One italic sentence explaining the figure.</figcaption>
    </figure>

    <p>A connecting paragraph.</p>

    <div class="callout callout-green">
      <h4>Kapittelets kjerneidé</h4>
      <p>One clear statement of the core insight.</p>
    </div>
  </div>
</section>

<section id="deler">
  <div class="container">
    <div class="section-badge">Deler</div>
    <h2>Utforsk <em>kapittelet</em></h2>
    <div class="subpage-list">
      <a href="subpage-slug.html" class="subpage-card">
        <div class="sp-icon">01–05</div>
        <div class="sp-info">
          <div class="sp-title">Subpage title</div>
          <div class="sp-desc">One-line description.</div>
        </div>
        <div class="sp-arrow">&rarr;</div>
      </a>
      <!-- repeat per subpage -->
    </div>
  </div>
</section>

<section id="quiz">
  <div class="container">
    <h2>Test deg selv</h2>
    <p class="section-intro">Sjekk om du har forstått de viktigste konseptene.</p>

    <div class="quiz" data-quiz>
      <div class="q-label">Spørsmål 1 · Lett</div>
      <div class="q-text">Question text?</div>
      <div class="quiz-reveal">
        <button class="reveal-btn">Se svar</button>
        <div class="answer">Answer text.</div>
      </div>
    </div>
    <!-- repeat for 15–25 items, tagged Lett / Middels / Vanskelig -->
  </div>
</section>
</main>

<footer>
  <div class="container">
    <div class="ornament">&#10043; &#10043; &#10043;</div>
    <p>NTNU · COURSE_CODE · SEMESTER</p>
  </div>
</footer>

<script src="../chat-widget.js"></script>
<script src="../nav-search.js"></script>
<script src="../quiz.js"></script>
</body>
</html>
```

### 7.3 Subpage (`kapN/<slug>.html`)

```html
<!DOCTYPE html>
<html lang="no">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Subpage title — Kapittel N</title>
<link rel="stylesheet" href="../style.css">
</head>
<body>
<nav class="site-nav">
  <div class="container">
    <a href="../" class="brand">COURSE_CODE</a>
    <a href="index.html" class="nav-back">&larr; Kapittel N</a>
    <div class="nav-search-wrapper">
      <svg class="nav-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" id="nav-search" placeholder="Laster…" autocomplete="off" disabled>
      <div id="nav-search-results"></div>
    </div>
  </div>
</nav>

<main data-chapter="Kapittel N: Chapter title">
<header class="hero">
  <div class="container">
    <div class="eyebrow">Kapittel N · Subtopic</div>
    <h1>Subpage <em>title</em></h1>
    <p class="lede">One-sentence lede.</p>
    <nav class="toc">
      <a href="#sec1"><span class="toc-num">01</span>Section 1 title</a>
      <a href="#sec2"><span class="toc-num">02</span>Section 2 title</a>
    </nav>
  </div>
</header>

<section id="sec1">
  <div class="container">
    <div class="section-badge">01 · Section</div>
    <h2>Section <em>title</em></h2>
    <p class="section-intro">Italic intro.</p>
    <p class="lead">Dropcap paragraph.</p>
    <figure class="fig-frame"><svg viewBox="0 0 720 370"></svg><figcaption>Italic caption.</figcaption></figure>
    <p>Body paragraph.</p>
    <div class="callout callout-blue"><h4>Merk</h4><p>Aside text.</p></div>
  </div>
</section>

<!-- repeat 3-8 sections -->

</main>

<footer>
  <div class="container">
    <div class="ornament">&#10043; &#10043; &#10043;</div>
    <p>NTNU · COURSE_CODE · SEMESTER</p>
  </div>
</footer>

<script src="../chat-widget.js"></script>
<script src="../nav-search.js"></script>
</body>
</html>
```

---

## 8. Design system — tokens

These are the only colors and fonts you use. Don't introduce new ones.

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f4f1ea` | page background |
| `--paper-dark` | `#e8e3d6` | callouts, figure backgrounds |
| `--paper-darker` | `#ddd5c4` | — |
| `--ink` | `#1a1612` | body text |
| `--ink-soft` | `#3d3832` | secondary text |
| `--ink-faded` | `#6b6257` | tertiary text, captions |
| `--ink-ghost` | `#a39886` | metadata |
| `--rust` | `#b04428` | primary accent, links, italic emphasis |
| `--rust-dark` | `#8a3420` | hover accent |
| `--blue` | `#2d4a7a` | info callouts |
| `--green` | `#3d6b3a` | positive callouts, "kjerneidé" box |
| `--ochre` | `#c68a1f` | warnings, margin notes |
| `--line` | `#c9c0ae` | borders |
| `--line-soft` | `#ddd5c4` | soft dividers |

Fonts: `Newsreader` (serif, body), `IBM Plex Mono` (mono), `IBM Plex Sans` (sans, UI chrome). Loaded from Google Fonts.

---

## 9. `style.css` — paste verbatim

Save as `style.css` at repo root. This is the full visual identity. Do not edit tokens or class names.

```css
/* ============================================
   Shared Stylesheet — editorial paper + rust
   ============================================ */

/* ---------- FONTS ---------- */
@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,700;1,6..72,400;1,6..72,500&family=IBM+Plex+Mono:wght@400;500;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

/* ---------- VARIABLES ---------- */
:root {
  --paper: #f4f1ea;
  --paper-dark: #e8e3d6;
  --paper-darker: #ddd5c4;
  --ink: #1a1612;
  --ink-soft: #3d3832;
  --ink-faded: #6b6257;
  --ink-ghost: #a39886;
  --rust: #b04428;
  --rust-dark: #8a3420;
  --blue: #2d4a7a;
  --green: #3d6b3a;
  --ochre: #c68a1f;
  --line: #c9c0ae;
  --line-soft: #ddd5c4;
  --serif: 'Newsreader', Georgia, serif;
  --mono: 'IBM Plex Mono', Menlo, monospace;
  --sans: 'IBM Plex Sans', system-ui, sans-serif;
  --packet-hl: #f5eae5;
}

/* ---------- RESET ---------- */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  font-family: var(--serif);
  font-size: 18px;
  line-height: 1.7;
  color: var(--ink);
  background: var(--paper);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "kern", "liga";
  position: relative;
}

/* Paper texture overlay */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.42 0 0 0 0 0.38 0 0 0 0 0.33 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.35;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: multiply;
}

/* ---------- LAYOUT ---------- */
.container { max-width: 820px; margin: 0 auto; padding: 0 32px; position: relative; z-index: 2; }
.container-wide, .container.wide { max-width: 1000px; margin: 0 auto; padding: 0 32px; position: relative; z-index: 2; }

/* ---------- SITE NAV ---------- */
.site-nav { position: sticky; top: 0; z-index: 100; background: rgba(244,241,234,0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--line); padding: 14px 0; }
.site-nav .container { display: flex; align-items: center; justify-content: space-between; }
.site-nav .brand { font-family: var(--mono); font-size: 13px; font-weight: 700; letter-spacing: 0.1em; color: var(--rust); text-decoration: none; }
.site-nav .brand:hover { color: var(--rust-dark); }
.site-nav .nav-back { font-family: var(--sans); font-size: 13px; font-weight: 500; color: var(--ink-faded); text-decoration: none; display: flex; align-items: center; gap: 6px; transition: color 0.15s; }
.site-nav .nav-back:hover { color: var(--rust); }

/* ---------- NAV SEARCH ---------- */
.nav-search-wrapper { position: relative; width: 240px; margin-left: auto; }
#nav-search { width: 100%; font-family: var(--sans); font-size: 13px; padding: 6px 12px 6px 32px; border: 1px solid rgba(176,68,40,0.3); border-radius: 3px; background: var(--paper); color: var(--ink); outline: none; }
#nav-search:focus { border-color: var(--rust); box-shadow: 0 0 0 2px rgba(176,68,40,0.14); }
#nav-search::placeholder { color: var(--ink-ghost); }
.nav-search-icon { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); width: 13px; height: 13px; color: var(--ink-ghost); pointer-events: none; }
#nav-search-results { display: none; position: absolute; top: calc(100% + 4px); right: 0; min-width: 320px; background: var(--paper); border: 1px solid var(--line); border-radius: 4px; box-shadow: 0 8px 24px rgba(26,22,18,0.13); max-height: 400px; overflow-y: auto; z-index: 200; }
#nav-search-results.active { display: block; }
.nav-sr-item { display: block; padding: 12px 14px; text-decoration: none; color: inherit; border-bottom: 1px solid var(--line-soft); }
.nav-sr-item:hover, .nav-sr-item.nav-sr-active { background: var(--paper-dark); }
.nav-sr-chapter { font-family: var(--mono); font-size: 10px; color: var(--rust); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2px; }
.nav-sr-title { font-family: var(--serif); font-size: 15px; font-weight: 500; margin-bottom: 2px; }
.nav-sr-body { font-size: 12px; color: var(--ink-faded); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.nav-sr-body mark { background: rgba(176,68,40,0.15); color: var(--rust); padding: 0 1px; border-radius: 2px; }
.nav-sr-empty { padding: 14px; color: var(--ink-ghost); font-style: italic; font-size: 13px; }
@media (max-width: 600px) {
  .nav-search-wrapper { width: 160px; }
  #nav-search { font-size: 16px; }
  #nav-search-results { position: fixed; top: 56px; left: 8px; right: 8px; min-width: 0; width: auto; max-height: 60vh; }
}

/* ---------- HERO ---------- */
.hero { padding: 100px 0 70px; border-bottom: 1px solid var(--line); }
.hero .eyebrow { font-family: var(--mono); font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--rust); margin-bottom: 28px; display: inline-block; }
.hero h1 { font-family: var(--serif); font-size: clamp(44px, 7vw, 84px); font-weight: 500; line-height: 1.02; letter-spacing: -0.025em; margin-bottom: 28px; }
.hero h1 em { font-style: italic; font-weight: 400; color: var(--rust); }
.hero .lede, .hero .sub, .hero .subtitle { font-family: var(--serif); font-style: italic; font-size: 22px; line-height: 1.5; color: var(--ink-soft); max-width: 650px; margin-bottom: 40px; }

/* Hero TOC */
.toc { border-top: 1px solid var(--line); padding-top: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 40px; font-family: var(--sans); font-size: 14px; color: var(--ink-faded); }
.toc a { color: var(--ink-soft); text-decoration: none; display: flex; align-items: baseline; gap: 14px; padding: 8px 0; border-bottom: 1px solid var(--line-soft); transition: color 0.15s, padding-left 0.15s; }
.toc a:hover { color: var(--rust); padding-left: 6px; }
.toc .toc-num { font-family: var(--mono); color: var(--ink-ghost); font-size: 12px; min-width: 20px; }

/* ---------- SECTIONS ---------- */
section { padding: 80px 0; border-bottom: 1px solid var(--line); }
.section-badge, .badge { font-family: var(--mono); font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--ink-faded); display: inline-block; padding: 6px 14px; border: 1px solid var(--line); border-radius: 2px; margin-bottom: 28px; background: var(--paper); }

/* ---------- TYPOGRAPHY ---------- */
h2 { font-family: var(--serif); font-size: clamp(32px, 4.5vw, 50px); font-weight: 500; line-height: 1.1; letter-spacing: -0.018em; margin-bottom: 18px; }
h2 em { font-style: italic; color: var(--rust); font-weight: 400; }
.section-intro { font-family: var(--serif); font-style: italic; font-size: 20px; line-height: 1.5; color: var(--ink-soft); margin-bottom: 40px; max-width: 680px; }
h3 { font-family: var(--serif); font-size: 26px; font-weight: 500; line-height: 1.25; margin: 52px 0 16px; letter-spacing: -0.01em; }
h4 { font-family: var(--sans); font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--rust); margin: 32px 0 12px; }
p { margin-bottom: 20px; }
strong { font-weight: 600; color: var(--ink); }
em { font-style: italic; }
a { color: var(--rust); text-decoration: underline; text-decoration-color: var(--line); text-underline-offset: 3px; }
a:hover { text-decoration-color: var(--rust); }

/* Drop cap */
.dropcap::first-letter, p.lead::first-letter { font-family: var(--serif); font-size: 5.2em; float: left; line-height: 0.85; padding: 8px 10px 0 0; color: var(--rust); font-weight: 500; }

/* Inline code */
code, .mono { font-family: var(--mono); font-size: 0.88em; background: var(--paper-dark); padding: 2px 6px; border-radius: 2px; color: var(--rust-dark); }

ul, ol { margin: 0 0 20px 24px; }
li { margin-bottom: 8px; }

/* ---------- MARGIN NOTES ---------- */
.margin-note { border-left: 3px solid var(--ochre); padding: 4px 0 4px 20px; margin: 28px 0; font-style: italic; color: var(--ink-soft); font-size: 16px; line-height: 1.55; }
.margin-note strong { color: var(--ink-soft); font-style: normal; }

/* ---------- CALLOUTS ---------- */
.callout { background: var(--paper-dark); border-left: 4px solid var(--rust); padding: 24px 28px; margin: 32px 0; border-radius: 0 2px 2px 0; }
.callout h4 { margin-top: 0; color: var(--rust-dark); }
.callout p:last-child { margin-bottom: 0; }
.callout-blue { border-left-color: var(--blue); }
.callout-blue h4 { color: var(--blue); }
.callout-green { border-left-color: var(--green); }
.callout-green h4 { color: var(--green); }
.callout .label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--rust); margin-bottom: 10px; display: block; }

/* ---------- FIGURES ---------- */
figure { margin: 40px 0; padding: 24px; background: var(--paper-dark); border: 1px solid var(--line); border-radius: 2px; }
figure svg { display: block; margin: 0 auto; max-width: 100%; height: auto; }
figcaption { font-family: var(--serif); font-style: italic; font-size: 14px; color: var(--ink-faded); text-align: center; margin-top: 14px; line-height: 1.5; }
figcaption strong { font-style: normal; color: var(--ink-soft); }
.fig-frame { border: 1px solid var(--line); background: var(--paper); padding: 28px; }

/* ---------- TABLES ---------- */
table { width: 100%; border-collapse: collapse; margin: 28px 0; font-size: 16px; }
th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--line-soft); vertical-align: top; }
th { font-family: var(--sans); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-faded); background: var(--paper-dark); border-bottom: 2px solid var(--line); }
tbody tr:hover { background: rgba(176,68,40,0.04); }
td.mono-cell { font-family: var(--mono); font-size: 14px; color: var(--rust-dark); }

/* ---------- CODE BLOCKS ---------- */
pre { font-family: var(--mono); font-size: 13px; line-height: 1.55; background: #1a1612; color: #e8e3d6; padding: 20px 24px; border-radius: 3px; overflow-x: auto; margin: 24px 0; }
pre code { background: none; color: inherit; padding: 0; }
pre .comment { color: #8a7f6b; font-style: italic; }
pre .keyword { color: #c68a1f; }
pre .value { color: #9fb56b; }

/* ---------- ORNAMENT DIVIDER ---------- */
.ornament { text-align: center; color: var(--rust); font-size: 18px; letter-spacing: 1em; margin: 56px 0; }

/* ---------- QUIZ ---------- */
.quiz { background: var(--paper-dark); border: 1px solid var(--line); border-radius: 3px; padding: 28px 32px; margin: 40px 0; }
.quiz .q-label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--rust); margin-bottom: 10px; }
.quiz .q-text { font-family: var(--serif); font-size: 19px; font-weight: 500; margin-bottom: 20px; line-height: 1.4; color: var(--ink); }
.quiz-reveal { display: flex; flex-direction: column; gap: 12px; }
.quiz button.reveal-btn { font-family: var(--mono); font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; background: transparent; border: 1px solid var(--rust); color: var(--rust); padding: 10px 20px; cursor: pointer; border-radius: 2px; align-self: flex-start; transition: all 0.15s; }
.quiz button.reveal-btn:hover { background: #fff9ee; }
.quiz button.reveal-btn.used { opacity: 0.4; cursor: default; }
.quiz .answer { padding: 16px 20px; background: var(--paper); border-left: 3px solid var(--green); font-family: var(--serif); font-size: 16px; color: var(--ink); line-height: 1.5; display: none; }
.quiz .answer.show { display: block; }

/* ---------- FOOTER ---------- */
footer { padding: 80px 0 60px; text-align: center; }
footer .ornament { margin: 0 0 24px; }
footer p { font-style: italic; color: var(--ink-faded); font-size: 15px; margin-bottom: 8px; }

/* ---------- CHAPTER TOC (chapter hub) ---------- */
.chapter-toc { padding: 28px 0; border-bottom: 1px solid var(--line); background: var(--paper-dark); }
.chapter-toc .chapter-toc-list { display: flex; gap: 32px; list-style: none; margin: 0; padding: 0; flex-wrap: wrap; }
.chapter-toc .chapter-toc-list li { margin: 0; display: flex; align-items: baseline; gap: 10px; }
.chapter-toc .chapter-toc-list .toc-num { font-family: var(--mono); font-size: 12px; color: var(--ink-ghost); font-weight: 600; }
.chapter-toc .chapter-toc-list a { font-family: var(--sans); font-size: 15px; font-weight: 500; color: var(--ink-soft); text-decoration: none; transition: color 0.15s; }
.chapter-toc .chapter-toc-list a:hover { color: var(--rust); }
@media (max-width: 768px) { .chapter-toc .chapter-toc-list { flex-direction: column; gap: 12px; } }

/* ---------- SUBPAGE LIST ---------- */
.subpage-list { display: grid; grid-template-columns: 1fr; gap: 0; }
.subpage-card { display: grid; grid-template-columns: 50px 1fr auto; align-items: center; gap: 20px; padding: 24px 0; border-bottom: 1px solid var(--line-soft); text-decoration: none; color: inherit; transition: background 0.15s, padding 0.15s; }
.subpage-card:first-child { border-top: 1px solid var(--line-soft); }
.subpage-card:hover { background: var(--paper-dark); padding-left: 16px; padding-right: 16px; margin-left: -16px; margin-right: -16px; border-radius: 4px; }
.subpage-card .sp-icon { font-family: var(--mono); font-size: 13px; color: var(--rust); font-weight: 600; }
.subpage-card .sp-title { font-family: var(--serif); font-size: 20px; font-weight: 500; line-height: 1.3; margin-bottom: 4px; }
.subpage-card .sp-desc { font-size: 14px; color: var(--ink-faded); font-style: italic; line-height: 1.45; }
.subpage-card .sp-arrow { font-family: var(--mono); font-size: 18px; color: var(--ink-ghost); transition: color 0.15s, transform 0.15s; }
.subpage-card:hover .sp-arrow { color: var(--rust); transform: translateX(4px); }

/* ---------- RESPONSIVE ---------- */
@media (max-width: 768px) {
  body { font-size: 17px; }
  .container, .container-wide, .container.wide { padding: 0 20px; }
  .hero { padding: 60px 0 40px; }
  .hero h1 { font-size: 42px !important; }
  .toc { grid-template-columns: 1fr; }
  section { padding: 60px 0; }
  h2 { font-size: 30px !important; }
  h3 { font-size: 22px; }
  .callout, .quiz { padding: 20px; }
  figure { padding: 16px; overflow-x: auto; }
  pre { font-size: 12px; }
  .subpage-list { grid-template-columns: 1fr; }
  p.lead::first-letter, .dropcap::first-letter { font-size: 4em; }
}

/* ---------- CHAT WIDGET ---------- */
.chat-fab {
  position: fixed; bottom: 24px; right: 24px; z-index: 200;
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--rust); color: var(--paper);
  border: none; cursor: pointer;
  box-shadow: 0 6px 20px rgba(26,22,18,0.18);
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.15s, background 0.15s;
}
.chat-fab:hover { background: var(--rust-dark); transform: translateY(-1px); }
.chat-fab svg { width: 24px; height: 24px; }
.chat-panel {
  position: fixed; bottom: 96px; right: 24px; z-index: 201;
  width: min(420px, calc(100vw - 48px)); height: min(640px, calc(100vh - 140px));
  background: var(--paper); border: 1px solid var(--line); border-radius: 8px;
  box-shadow: 0 12px 32px rgba(26,22,18,0.22);
  display: none; flex-direction: column; overflow: hidden;
}
.chat-panel.open { display: flex; }
.chat-head {
  padding: 14px 18px; border-bottom: 1px solid var(--line); background: var(--paper-dark);
  display: flex; justify-content: space-between; align-items: center;
}
.chat-head h3 { font-family: var(--serif); font-size: 16px; font-weight: 500; margin: 0; }
.chat-head .close { background: none; border: none; color: var(--ink-faded); font-size: 20px; cursor: pointer; line-height: 1; }
.chat-body { flex: 1; overflow-y: auto; padding: 14px 16px; display: flex; flex-direction: column; gap: 12px; }
.chat-msg { font-family: var(--serif); font-size: 15px; line-height: 1.55; }
.chat-msg.user { align-self: flex-end; background: var(--rust); color: var(--paper); padding: 10px 14px; border-radius: 14px 14px 2px 14px; max-width: 85%; }
.chat-msg.assistant { align-self: flex-start; background: var(--paper-dark); color: var(--ink); padding: 10px 14px; border-radius: 14px 14px 14px 2px; max-width: 95%; }
.chat-msg.assistant code { background: rgba(26,22,18,0.08); }
.chat-foot { border-top: 1px solid var(--line); padding: 10px 12px; display: flex; gap: 8px; background: var(--paper); }
.chat-foot textarea { flex: 1; resize: none; border: 1px solid var(--line); border-radius: 4px; padding: 8px 10px; font-family: var(--serif); font-size: 15px; color: var(--ink); background: var(--paper); outline: none; min-height: 38px; max-height: 140px; }
.chat-foot textarea:focus { border-color: var(--rust); }
.chat-foot button { font-family: var(--mono); font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase; background: var(--rust); color: var(--paper); border: none; padding: 0 14px; border-radius: 4px; cursor: pointer; }
.chat-foot button:disabled { opacity: 0.4; cursor: default; }
.chat-preset { display: flex; gap: 6px; padding: 8px 12px 0; font-family: var(--mono); font-size: 11px; color: var(--ink-faded); }
.chat-preset button { background: none; border: 1px solid var(--line); color: var(--ink-faded); padding: 3px 8px; border-radius: 2px; cursor: pointer; font-family: inherit; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
.chat-preset button.active { border-color: var(--rust); color: var(--rust); }
```

If you later need packet-header grids, stepper widgets, or other complex components, add them as new CSS blocks — don't rewrite the tokens.

---

## 10. `quiz.js` — paste verbatim

```javascript
(function () {
  document.querySelectorAll('[data-quiz]').forEach(function (quiz) {
    var btn = quiz.querySelector('.reveal-btn');
    var answer = quiz.querySelector('.answer');
    if (!btn || !answer) return;
    btn.addEventListener('click', function () {
      answer.classList.add('show');
      btn.classList.add('used');
      btn.disabled = true;
    });
  });
})();
```

---

## 11. `nav-search.js` — paste verbatim, edit PAGES list

The only thing to edit in this file is the `PAGES` array at the top — list every searchable page in the site. The script is loaded from chapter pages (one level deep), so paths are relative to repo root with `PREFIX = '../'`.

```javascript
(function() {
  var PREFIX = '../';
  var PAGES = [
    // EDIT THIS — every searchable page in the site
    'kap1/index.html',
    'kap2/index.html',
    // 'kap2/some-subpage.html', etc.
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
```

---

## 12. `lang-switch.js` — only if doing i18n

```javascript
(function() {
  var path = window.location.pathname;
  var inEn = path.indexOf('/en/') !== -1;
  var a = document.createElement('a');
  a.className = 'lang-switch';
  a.style.cssText = 'font-family:var(--mono);font-size:11px;letter-spacing:0.12em;color:var(--rust);text-decoration:none;border:1px solid var(--rust);padding:3px 10px;border-radius:2px;margin-left:auto;';
  if (inEn) { a.href = path.replace('/en/', '/'); a.textContent = 'NORSK'; }
  else {
    var base = path.substring(0, path.lastIndexOf('/') + 1);
    var file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    var kapMatch = path.match(/\/(kap\d+)\//);
    if (kapMatch) a.href = base.replace('/' + kapMatch[1] + '/', '/en/' + kapMatch[1] + '/') + file;
    else a.href = base + 'en/' + (file || '');
    a.textContent = 'EN';
  }
  var nav = document.querySelector('.site-nav .container');
  if (nav) { nav.style.display='flex'; nav.style.alignItems='center'; nav.appendChild(a); return; }
  var code = document.querySelector('.index-hero .course-code');
  if (code) { a.style.marginLeft='12px'; code.parentNode.insertBefore(a, code.nextSibling); }
})();
```

---

## 13. `chat-widget.js` — contract + reference implementation

### 13.1 Contract

- **Included on every page** via a single `<script src="…/chat-widget.js"></script>` tag.
- Renders a floating action button (FAB) bottom-right. Clicking it opens a chat panel.
- On each user message, the widget:
  1. Collects **page context**:
     - `chapter`: `document.querySelector('main').dataset.chapter` (fallback: `document.title`).
     - `section`: nearest `<section id>` to the current scroll position, with `{id, title}` (h2 text).
     - `visible_text`: text content currently in or near the viewport, truncated to ~4000 chars.
     - `url`: `location.pathname`.
     - `locale`: `'en'` if path contains `/en/`, else `'no'`.
  2. Sends JSON `POST /api/chat`:
     ```json
     { "question": "...", "page_context": {...}, "history": [ {"role":"user|assistant","content":"..."} ], "preset": "balanced" }
     ```
  3. Server responds with **NDJSON over HTTP** (one JSON object per line):
     - `{"t":"chunk"}` — a text delta to append to the assistant message.
     - `{"e":"error message"}` — fatal error.
     - `{"d":true}` — done.
  4. Widget streams the deltas into the assistant message bubble live, scrolling the chat body to bottom.
- A small preset switcher offers **Fast / Balanced / Quality**. Stored in `localStorage`.

### 13.2 Reference implementation (complete)

```javascript
(function() {
  var root = document.body;
  var fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  fab.title = 'Still et spørsmål';
  root.appendChild(fab);

  var panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.innerHTML =
    '<div class="chat-head"><h3>Studieassistent</h3><button class="close" aria-label="Close">×</button></div>' +
    '<div class="chat-preset">' +
      '<button data-preset="fast">Fast</button>' +
      '<button data-preset="balanced" class="active">Balanced</button>' +
      '<button data-preset="quality">Quality</button>' +
    '</div>' +
    '<div class="chat-body"></div>' +
    '<div class="chat-foot">' +
      '<textarea placeholder="Still et spørsmål…" rows="1"></textarea>' +
      '<button class="chat-send">Send</button>' +
    '</div>';
  root.appendChild(panel);

  var body = panel.querySelector('.chat-body');
  var textarea = panel.querySelector('textarea');
  var sendBtn = panel.querySelector('.chat-send');
  var history = [];
  var preset = localStorage.getItem('chat-preset') || 'balanced';

  fab.addEventListener('click', function(){ panel.classList.toggle('open'); if (panel.classList.contains('open')) textarea.focus(); });
  panel.querySelector('.close').addEventListener('click', function(){ panel.classList.remove('open'); });

  panel.querySelectorAll('.chat-preset button').forEach(function(b){
    if (b.dataset.preset === preset) b.classList.add('active');
    b.addEventListener('click', function(){
      preset = b.dataset.preset;
      localStorage.setItem('chat-preset', preset);
      panel.querySelectorAll('.chat-preset button').forEach(function(x){ x.classList.remove('active'); });
      b.classList.add('active');
    });
  });

  function collectPageContext() {
    var mainEl = document.querySelector('main');
    var chapter = mainEl ? (mainEl.dataset.chapter || document.title) : document.title;
    // nearest section by scroll position
    var sec = null, best = Infinity;
    document.querySelectorAll('section[id]').forEach(function(s){
      var r = s.getBoundingClientRect();
      var d = Math.abs(r.top);
      if (r.bottom > 0 && d < best) { best = d; sec = s; }
    });
    var section = sec ? { id: sec.id, title: (sec.querySelector('h2')||{}).textContent || '' } : null;
    // visible text
    var visible = '';
    if (mainEl) {
      var walker = document.createTreeWalker(mainEl, NodeFilter.SHOW_TEXT, null);
      var chunks = [];
      while (walker.nextNode()) {
        var node = walker.currentNode;
        var parent = node.parentElement;
        if (!parent) continue;
        var r = parent.getBoundingClientRect();
        if (r.bottom < -100 || r.top > window.innerHeight + 100) continue;
        var t = node.textContent.trim();
        if (t) chunks.push(t);
      }
      visible = chunks.join(' ').slice(0, 4000);
    }
    var locale = location.pathname.indexOf('/en/') !== -1 ? 'en' : 'no';
    return { chapter: chapter, section: section, visible_text: visible, url: location.pathname, locale: locale };
  }

  function appendMsg(role, text) {
    var div = document.createElement('div');
    div.className = 'chat-msg ' + role;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  async function send() {
    var q = textarea.value.trim();
    if (!q) return;
    textarea.value = '';
    sendBtn.disabled = true;
    appendMsg('user', q);
    var assistant = appendMsg('assistant', '');
    var buffer = '';

    try {
      var resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, page_context: collectPageContext(), history: history, preset: preset })
      });
      if (!resp.ok || !resp.body) {
        var err = await resp.text();
        assistant.textContent = 'Feil: ' + err;
        return;
      }
      var reader = resp.body.getReader();
      var decoder = new TextDecoder();
      var carry = '';
      while (true) {
        var r = await reader.read();
        if (r.done) break;
        carry += decoder.decode(r.value, { stream: true });
        var lines = carry.split('\n');
        carry = lines.pop();
        for (var i=0; i<lines.length; i++) {
          var line = lines[i].trim();
          if (!line) continue;
          try {
            var obj = JSON.parse(line);
            if (obj.t) { buffer += obj.t; assistant.textContent = buffer; body.scrollTop = body.scrollHeight; }
            else if (obj.e) { assistant.textContent += '\n[Feil: ' + obj.e + ']'; }
          } catch (_) { /* skip */ }
        }
      }
      history.push({ role: 'user', content: q });
      history.push({ role: 'assistant', content: buffer });
      if (history.length > 10) history = history.slice(-10);
    } catch (err) {
      assistant.textContent = 'Nettverksfeil: ' + err.message;
    } finally {
      sendBtn.disabled = false;
    }
  }

  sendBtn.addEventListener('click', send);
  textarea.addEventListener('keydown', function(e){
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
})();
```

This reference intentionally skips markdown/KaTeX rendering. Add those later if needed — use `marked` + KaTeX from CDN and render the final buffer on each delta.

---

## 14. `api/chat.js` — contract + reference implementation

### 14.1 Contract

- Vercel serverless function at `/api/chat`, runtime default (Node).
- Reads `public/chunks.json` on first call, caches in module scope.
- POST body: `{ question, page_context, history, preset }`.
- Flow:
  1. Embed the question (optionally prefixed with chapter + section) using OpenRouter embeddings.
  2. Cosine-similarity against `chunks.json`, take top 3, with a small chapter-match boost.
  3. Build a system prompt: course identity + rules + visible text + retrieved book excerpts.
  4. Stream from OpenRouter chat completions.
  5. Translate upstream SSE into NDJSON lines: `{"t":"..."}`, `{"e":"..."}`, `{"d":true}`.
- Reads `OPENROUTER_API_KEY` from env. Optional per-preset overrides: `OPENROUTER_CHAT_MODEL_FAST|BALANCED|QUALITY`.

### 14.2 Reference implementation

```javascript
import { readFileSync } from "fs";
import { join } from "path";

let chunks = null;
function loadChunks() {
  if (chunks) return chunks;
  const raw = readFileSync(join(process.cwd(), "public", "chunks.json"), "utf-8");
  chunks = JSON.parse(raw);
  return chunks;
}

function cosine(a, b) {
  let d=0, ma=0, mb=0;
  for (let i=0; i<a.length; i++) { d+=a[i]*b[i]; ma+=a[i]*a[i]; mb+=b[i]*b[i]; }
  return d / (Math.sqrt(ma)*Math.sqrt(mb));
}

async function embed(text, apiKey) {
  const r = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "nvidia/llama-nemotron-embed-vl-1b-v2:free",
      input: [text], encoding_format: "float",
    }),
  });
  if (!r.ok) throw new Error(`embed ${r.status}: ${await r.text()}`);
  const d = await r.json();
  return d.data[0].embedding;
}

function topChunks(qEmb, all, n, chapterHint) {
  const scored = all.filter(c=>c.embedding).map(c=>{
    let s = cosine(qEmb, c.embedding);
    if (chapterHint && c.chapter && c.chapter.toLowerCase().includes(chapterHint.toLowerCase())) s += 0.03;
    return { text: c.text, chapter: c.chapter, score: s };
  });
  scored.sort((a,b)=>b.score-a.score);
  return scored.slice(0, n);
}

const PRESETS = {
  fast: "liquid/lfm-2.5-1.2b-instruct:free",
  balanced: "google/gemma-4-26b-a4b-it:free",
  quality: "openai/gpt-oss-120b:free",
};

function modelFor(preset) {
  const envKey = `OPENROUTER_CHAT_MODEL_${preset.toUpperCase()}`;
  return process.env[envKey] || PRESETS[preset] || PRESETS.balanced;
}

function json(body, status=200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

const NDJSON = { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" };

function sseToNdjson(upstream) {
  const enc = new TextEncoder(), dec = new TextDecoder();
  return new ReadableStream({
    async start(controller) {
      const reader = upstream.getReader();
      let buf = "";
      const write = o => controller.enqueue(enc.encode(JSON.stringify(o) + "\n"));
      try {
        while (true) {
          const { done, value } = await reader.read();
          buf += dec.decode(value ?? new Uint8Array(), { stream: !done });
          if (done) break;
          buf = buf.replace(/\r\n/g, "\n");
          while (true) {
            const sep = buf.indexOf("\n\n");
            if (sep === -1) break;
            const block = buf.slice(0, sep);
            buf = buf.slice(sep + 2);
            for (const line of block.split("\n")) {
              if (!line.startsWith("data:")) continue;
              const raw = line.slice(5).trimStart();
              if (raw === "[DONE]") continue;
              try {
                const j = JSON.parse(raw);
                if (j.error) { write({ e: typeof j.error === "string" ? j.error : j.error.message }); controller.close(); return; }
                const piece = j.choices?.[0]?.delta?.content;
                if (typeof piece === "string" && piece) write({ t: piece });
              } catch {}
            }
          }
        }
        write({ d: true });
        controller.close();
      } catch (err) {
        try { write({ e: err.message || String(err) }); } catch {}
        controller.close();
      }
    }
  });
}

export async function POST(request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return json({ error: "OPENROUTER_API_KEY not set" }, 500);

  try {
    const { question, page_context, history, preset } = await request.json();
    if (!question) return json({ error: "Missing question" }, 400);

    const locale = (page_context?.locale || "no").startsWith("en") ? "en" : "no";

    let searchQuery = question;
    if (page_context?.section?.title) searchQuery = `[${page_context.chapter} – ${page_context.section.title}] ${question}`;
    else if (page_context?.chapter) searchQuery = `[${page_context.chapter}] ${question}`;

    const embPromise = embed(searchQuery, apiKey);
    const all = loadChunks();
    const qEmb = await embPromise;
    const top = topChunks(qEmb, all, 3, page_context?.chapter || null);
    let bookCtx = top.map(c => c.text).join("\n\n---\n\n");
    if (bookCtx.length > 12000) bookCtx = bookCtx.slice(0, 12000) + "\n\n[… forkortet …]";

    const intro = locale === "en"
      ? `You are a study assistant for COURSE_CODE — COURSE_TITLE. Ground answers in the textbook excerpts and the visible page text below.`
      : `Du er en studieassistent for COURSE_CODE — COURSE_TITLE. Bygg svaret på utdragene fra boka og den synlige teksten under.`;

    const rules = locale === "en"
      ? `Answer in English. Be concrete and grounded. If the answer isn't in the context, say so. Use $...$ or \\(...\\) for inline math and $$...$$ for display math.`
      : `Svar på norsk (bokmål). Vær konkret og grunnet. Si ifra hvis svaret ikke finnes i konteksten. Bruk $...$ eller \\(...\\) for inline matte og $$...$$ for displaymatte.`;

    const locInfo = page_context?.chapter
      ? (locale === "en"
          ? `The user is reading: ${page_context.chapter}${page_context.section?.title ? ` — section: “${page_context.section.title}”` : ""}`
          : `Brukeren leser: ${page_context.chapter}${page_context.section?.title ? ` — seksjon: «${page_context.section.title}»` : ""}`)
      : "";

    const visible = page_context?.visible_text || "(none)";
    const system = `${intro}\n${rules}\n${locInfo}\n\n## Synlig tekst:\n${visible}\n\n## Utdrag fra boka:\n${bookCtx}`;

    const messages = [
      { role: "system", content: system },
      ...(history || []),
      { role: "user", content: question },
    ];

    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: modelFor(preset || "balanced"), messages, stream: true }),
    });
    if (!r.ok || !r.body) return json({ error: `LLM ${r.status}: ${await r.text()}` }, 502);

    return new Response(sseToNdjson(r.body), { status: 200, headers: NDJSON });
  } catch (err) {
    console.error(err);
    return json({ error: err.message }, 500);
  }
}
```

---

## 15. Book corpus — `public/chunks.json`

One-time data pipeline. Run locally; commit the output.

### 15.1 Schema

```json
[
  { "text": "…chunk of book prose…", "chapter": "Kapittel 3: Transportlaget", "embedding": [0.0123, -0.044, ...] }
]
```

- `text`: 800–1200 characters of consecutive book prose, split on paragraph boundaries (never mid-sentence).
- `chapter`: human-readable label matching what `data-chapter` holds on the relevant site page. The chapter-boost in `api/chat.js` does a substring match, so consistency matters.
- `embedding`: float vector from `nvidia/llama-nemotron-embed-vl-1b-v2:free` (OpenRouter).

### 15.2 Build script — `tools/build_chunks.py`

```python
"""
Extract -> chunk -> embed the course book into public/chunks.json.
Usage: python tools/build_chunks.py book/coursebook.pdf
"""
import json, os, re, sys, time
from pathlib import Path
import pdfplumber
import requests

API_KEY = os.environ["OPENROUTER_API_KEY"]
MODEL = "nvidia/llama-nemotron-embed-vl-1b-v2:free"
OUT = Path("public/chunks.json")
TARGET_LEN = 1000
MIN_LEN = 600

# Map book chapter numbers -> site chapter labels. EDIT this.
CHAPTER_LABELS = {
    1: "Kapittel 1: Intro",
    2: "Kapittel 2: Title",
    # ...
}

def extract_text_by_chapter(pdf_path):
    """Return list of (chapter_num, text) tuples.
    Detect chapter boundaries however the book does it —
    often a line matching r'^Chapter\s+(\d+)' or r'^Kapittel\s+(\d+)'."""
    buffers = {}
    current = None
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ""
            for line in text.split("\n"):
                m = re.match(r"^\s*(Chapter|Kapittel)\s+(\d+)", line)
                if m:
                    current = int(m.group(2))
                    buffers.setdefault(current, [])
                    continue
                if current is not None:
                    buffers[current].append(line)
    return [(n, "\n".join(lines)) for n, lines in buffers.items()]

def chunk(text, target=TARGET_LEN, min_len=MIN_LEN):
    paras = re.split(r"\n\s*\n", text)
    out, cur = [], ""
    for p in paras:
        p = p.strip()
        if not p: continue
        if len(cur) + len(p) + 2 <= target:
            cur = (cur + "\n\n" + p) if cur else p
        else:
            if len(cur) >= min_len: out.append(cur); cur = p
            else: cur = (cur + "\n\n" + p) if cur else p
    if cur: out.append(cur)
    return out

def embed(text):
    r = requests.post(
        "https://openrouter.ai/api/v1/embeddings",
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        json={"model": MODEL, "input": [text], "encoding_format": "float"},
        timeout=60,
    )
    r.raise_for_status()
    return r.json()["data"][0]["embedding"]

def main(pdf_path):
    sections = extract_text_by_chapter(pdf_path)
    records = []
    for num, text in sections:
        label = CHAPTER_LABELS.get(num, f"Kapittel {num}")
        for c in chunk(text):
            records.append({"text": c, "chapter": label})
    print(f"{len(records)} chunks; embedding…")
    for i, rec in enumerate(records):
        for attempt in range(5):
            try:
                rec["embedding"] = embed(rec["text"])
                break
            except Exception as e:
                wait = 2 ** attempt
                print(f"  chunk {i}: {e}; retry in {wait}s")
                time.sleep(wait)
        if i % 20 == 0: print(f"  {i}/{len(records)}")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(records, ensure_ascii=False))
    print(f"wrote {OUT}")

if __name__ == "__main__":
    main(sys.argv[1])
```

Budget: a 600-page book ≈ 2–4k chunks ≈ 10–30 min on the free tier. Rate-limit with retries.

---

## 16. Deploy config

### `package.json`

```json
{
  "private": true,
  "type": "module",
  "dependencies": {
    "@vercel/analytics": "^2.0.1",
    "@vercel/speed-insights": "^2.0.0"
  }
}
```

### `vercel.json`

```json
{
  "buildCommand": "",
  "outputDirectory": ".",
  "functions": {
    "api/chat.js": { "maxDuration": 120 }
  }
}
```

### Deploy steps

1. `git init && git add . && git commit -m "initial"`.
2. Push to GitHub.
3. Import on Vercel. Framework preset: "Other". Output dir: `.`.
4. Set env var `OPENROUTER_API_KEY`. Optional: `OPENROUTER_CHAT_MODEL_BALANCED` etc. to override presets.
5. Deploy. Verify: landing page loads, search finds a section, chat opens and streams a reply, a quiz button reveals its answer.

---

## 17. Success criteria

The site is done when:

1. Landing page renders with the paper/rust identity and search returns real hits.
2. Every chapter has a hub + at least one subpage with working anchor TOC.
3. Chat widget opens on every page, pulls context from the current section, and streams a book-grounded answer.
4. Every quiz reveal works.
5. Mobile view at 375px and 768px looks right (no horizontal scroll, TOC collapses to single column).
6. A stranger reading a random subpage understands the subtopic in 15 minutes — because the analogies, figures, and callouts do the work the slides couldn't.

---

## 18. Non-goals

- No framework, no bundler, no TypeScript.
- No database, no user accounts, no auth.
- No screenshots of slides. SVG figures only.
- No AI-generated walls of prose paraphrasing the slides. Authored editorial voice only.
- No new color tokens or fonts. The palette is the identity.
