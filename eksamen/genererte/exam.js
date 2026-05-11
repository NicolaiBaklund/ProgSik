(function () {
  'use strict';

  const STORAGE_COLLAPSED = 'exam_tracker_collapsed';
  const NEXT_THRESHOLDS = [41, 53, 65, 77, 89];
  const GRADE_ORDER = ['F', 'E', 'D', 'C', 'B', 'A'];

  const SELF_GRADES = [
    { key: 'full',   label: 'Full pott',   factor: 1.0 },
    { key: 'mostly', label: 'Nesten alt',  factor: 0.75 },
    { key: 'half',   label: 'Halvveis',    factor: 0.5 },
    { key: 'little', label: 'Lite',        factor: 0.25 },
    { key: 'none',   label: 'Ingenting',   factor: 0.0 },
  ];

  const score = {
    earned: 0,
    totalPoints: 0,
    answered: 0,
    totalQuestions: 0,
    rootEl: null,
    panelEl: null,
    fabEl: null,
    fabGradeEl: null,
    fabPctEl: null,
    earnedEl: null,
    totalEl: null,
    answeredEl: null,
    qTotalEl: null,
    barFillEl: null,
    gradeValueEl: null,
    pctLabelEl: null,
    nextEl: null,
    ladderStepEls: null,
  };

  function init() {
    const articles = document.querySelectorAll('.exam-q');
    if (!articles.length) return;

    articles.forEach((article) => {
      const points = parsePoints(article.querySelector('.exam-q__points'));
      article.dataset.examPoints = String(points);
      score.totalPoints += points;
      score.totalQuestions += 1;
    });

    buildTracker();

    articles.forEach(setupQuestion);
  }

  function setupQuestion(article) {
    const isOpen = article.classList.contains('exam-q--open');
    const isMC = article.classList.contains('exam-q--mc');
    const hasOpts = !!article.querySelector('.exam-q__opts');
    const hasTF = !!article.querySelector('.exam-q__tf');

    if (isMC || (!isOpen && hasOpts)) setupMultiChoice(article);
    if (hasTF) setupTrueFalse(article);
    if (isOpen || (!isMC && !hasOpts && !hasTF)) setupOpen(article);
  }

  function parsePoints(el) {
    if (!el) return 0;
    const m = el.textContent.match(/(\d+(?:[.,]\d+)?)/);
    if (!m) return 0;
    return parseFloat(m[1].replace(',', '.'));
  }

  function fmtPoints(n) {
    const rounded = Math.round(n * 10) / 10;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  }

  function fmtPercent(p) {
    const rounded = Math.round(p * 10) / 10;
    return (Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)) + ' %';
  }

  function gradeFromPercent(p) {
    if (p >= 89) return 'A';
    if (p >= 77) return 'B';
    if (p >= 65) return 'C';
    if (p >= 53) return 'D';
    if (p >= 41) return 'E';
    return 'F';
  }

  function nextThresholdPercent(pct) {
    for (let i = 0; i < NEXT_THRESHOLDS.length; i++) {
      if (pct < NEXT_THRESHOLDS[i]) return NEXT_THRESHOLDS[i];
    }
    return null;
  }

  function loadCollapsedPref() {
    try { return localStorage.getItem(STORAGE_COLLAPSED) === '1'; }
    catch (e) { return false; }
  }

  function saveCollapsedPref(collapsed) {
    try { localStorage.setItem(STORAGE_COLLAPSED, collapsed ? '1' : '0'); }
    catch (e) {}
  }

  function setCollapsed(collapsed) {
    if (!score.rootEl) return;
    score.rootEl.classList.toggle('is-collapsed', collapsed);
    if (score.fabEl) {
      score.fabEl.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }
    saveCollapsedPref(collapsed);
  }

  function buildTracker() {
    const root = document.createElement('div');
    root.className = 'exam-tracker';

    const ladderSpans = GRADE_ORDER.map(
      (g) => `<span class="exam-tracker__step" data-grade="${g}">${g}</span>`
    ).join('');

    root.innerHTML = [
      '<button type="button" class="exam-tracker__fab" aria-label="Åpne poengoversikt">',
      '  <span class="exam-tracker__fab-grade">F</span>',
      '  <span class="exam-tracker__fab-pct">0 %</span>',
      '</button>',
      '<aside class="exam-tracker__panel" role="region" aria-label="Poengoversikt">',
      '  <div class="exam-tracker__header">',
      '    <span class="exam-tracker__title">Poengoversikt</span>',
      '    <button type="button" class="exam-tracker__close" aria-label="Lukk poengoversikt">×</button>',
      '  </div>',
      '  <div class="exam-tracker__grade-line">',
      '    <span class="exam-tracker__grade-readout">',
      '      Karakter <strong class="exam-tracker__grade-value">F</strong>',
      '      <span class="exam-tracker__pct-label"></span>',
      '    </span>',
      '  </div>',
      '  <div class="exam-tracker__ladder" aria-hidden="true">' + ladderSpans + '</div>',
      '  <p class="exam-tracker__next"></p>',
      '  <div class="exam-tracker__row">',
      '    <span class="exam-tracker__label">Poeng</span>',
      '    <span class="exam-tracker__score">',
      '      <span class="exam-tracker__earned">0</span>',
      '      <span class="exam-tracker__sep">/</span>',
      '      <span class="exam-tracker__total">0</span>',
      '    </span>',
      '  </div>',
      '  <div class="exam-tracker__bar"><div class="exam-tracker__bar-fill"></div></div>',
      '  <div class="exam-tracker__row exam-tracker__sub">',
      '    <span>Besvart</span>',
      '    <span><span class="exam-tracker__answered">0</span> / <span class="exam-tracker__qtotal">0</span></span>',
      '  </div>',
      '</aside>',
    ].join('');

    document.body.appendChild(root);

    score.rootEl = root;
    score.panelEl = root.querySelector('.exam-tracker__panel');
    score.fabEl = root.querySelector('.exam-tracker__fab');
    score.fabGradeEl = root.querySelector('.exam-tracker__fab-grade');
    score.fabPctEl = root.querySelector('.exam-tracker__fab-pct');
    score.earnedEl = root.querySelector('.exam-tracker__earned');
    score.totalEl = root.querySelector('.exam-tracker__total');
    score.answeredEl = root.querySelector('.exam-tracker__answered');
    score.qTotalEl = root.querySelector('.exam-tracker__qtotal');
    score.barFillEl = root.querySelector('.exam-tracker__bar-fill');
    score.gradeValueEl = root.querySelector('.exam-tracker__grade-value');
    score.pctLabelEl = root.querySelector('.exam-tracker__pct-label');
    score.nextEl = root.querySelector('.exam-tracker__next');
    score.ladderStepEls = Array.from(root.querySelectorAll('.exam-tracker__step'));

    score.totalEl.textContent = fmtPoints(score.totalPoints);
    score.qTotalEl.textContent = String(score.totalQuestions);

    score.fabEl.addEventListener('click', () => {
      setCollapsed(!score.rootEl.classList.contains('is-collapsed'));
    });
    root.querySelector('.exam-tracker__close').addEventListener('click', () => setCollapsed(true));

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (!score.rootEl || score.rootEl.classList.contains('is-collapsed')) return;
      const ae = document.activeElement;
      if (score.panelEl && score.panelEl.contains(ae)) setCollapsed(true);
    });

    setCollapsed(loadCollapsedPref());

    updateTracker();
  }

  function updateTracker() {
    if (!score.rootEl) return;

    score.earnedEl.textContent = fmtPoints(score.earned);
    score.answeredEl.textContent = String(score.answered);

    const pct = score.totalPoints > 0
      ? Math.max(0, Math.min(100, (score.earned / score.totalPoints) * 100))
      : 0;

    score.barFillEl.style.width = pct.toFixed(1) + '%';

    const letter = gradeFromPercent(pct);
    score.gradeValueEl.textContent = letter;
    score.fabGradeEl.textContent = letter;
    score.fabPctEl.textContent = fmtPercent(pct);
    score.pctLabelEl.textContent = ' · ' + fmtPercent(pct);

    score.fabEl.classList.remove(
      'exam-tracker__fab--f', 'exam-tracker__fab--e', 'exam-tracker__fab--d',
      'exam-tracker__fab--c', 'exam-tracker__fab--b', 'exam-tracker__fab--a'
    );
    score.fabEl.classList.add('exam-tracker__fab--' + letter.toLowerCase());

    score.ladderStepEls.forEach((el) => {
      el.classList.toggle('is-current', el.getAttribute('data-grade') === letter);
    });

    if (score.totalPoints <= 0) {
      score.nextEl.textContent = '';
    } else {
      const nextT = nextThresholdPercent(pct);
      if (nextT === null) {
        score.nextEl.textContent = 'Du ligger an til karakter A.';
      } else {
        const targetEarned = (nextT / 100) * score.totalPoints;
        const need = Math.max(0, Math.round((targetEarned - score.earned) * 10) / 10);
        const nextLetter = gradeFromPercent(nextT);
        score.nextEl.textContent = need > 0
          ? `${fmtPoints(need)} poeng til karakter ${nextLetter} (${nextT} %).`
          : '';
      }
    }

    const collapsed = score.rootEl.classList.contains('is-collapsed');
    score.fabEl.setAttribute(
      'aria-label',
      collapsed
        ? `Åpne poengoversikt. Karakter ${letter}, ${fmtPercent(pct)}`
        : 'Lukk poengoversikt'
    );

    if (score.answered >= score.totalQuestions && score.totalQuestions > 0) {
      score.rootEl.classList.add('is-complete');
    }
  }

  function addEarned(points) {
    score.earned += points;
    updateTracker();
  }

  function markAnswered() {
    score.answered += 1;
    updateTracker();
  }

  /* ------------------ MC ------------------ */

  function setupMultiChoice(article) {
    const opts = article.querySelector('.exam-q__opts');
    if (!opts) return;

    const correctSpan = article.querySelector('.fasit-correct');
    if (!correctSpan) return;

    const match = correctSpan.textContent.match(/Riktig svar:\s*([A-Z])/i);
    if (!match) return;
    const correctLetter = match[1].toUpperCase();

    const fasit = article.querySelector('.fasit-details');

    opts.classList.add('is-quiz');
    const items = Array.from(opts.querySelectorAll(':scope > li'));

    items.forEach((li) => {
      const labelEl = li.querySelector('.opt-label');
      if (!labelEl) return;
      const letter = labelEl.textContent.trim().toUpperCase();
      li.dataset.letter = letter;
      li.classList.add('is-clickable');
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', '0');

      const handler = () => selectAnswer(article, opts, items, li, letter, correctLetter, fasit);
      li.addEventListener('click', handler);
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler();
        }
      });
    });
  }

  function selectAnswer(article, opts, items, chosenLi, chosenLetter, correctLetter, fasit) {
    if (opts.classList.contains('is-answered')) return;
    opts.classList.add('is-answered');

    const isCorrect = chosenLetter === correctLetter;

    items.forEach((li) => {
      li.classList.remove('is-clickable');
      li.removeAttribute('tabindex');
      li.removeAttribute('role');
      const letter = li.dataset.letter;
      if (letter === correctLetter) li.classList.add('is-correct');
      if (li === chosenLi && !isCorrect) li.classList.add('is-wrong');
    });

    const points = parseFloat(article.dataset.examPoints) || 0;
    if (isCorrect) addEarned(points);
    markAnswered();

    if (fasit && !fasit.open) fasit.open = true;
  }

  /* ------------------ Sant/usant ------------------ */

  function setupTrueFalse(article) {
    const tfList = article.querySelector('.exam-q__tf');
    if (!tfList) return;

    const fasit = article.querySelector('.fasit-details');
    const fasitOl = fasit ? fasit.querySelector('.fasit-body ol') : null;
    if (!fasitOl) return;

    const answers = Array.from(fasitOl.querySelectorAll(':scope > li')).map((li) => {
      const strong = li.querySelector('strong');
      if (!strong) return null;
      const txt = strong.textContent.trim().toLowerCase();
      if (txt === 'sant') return 'true';
      if (txt === 'usant') return 'false';
      return null;
    });

    const fields = Array.from(tfList.querySelectorAll('.exam-q__tf-field'));
    if (!fields.length) return;

    tfList.classList.add('is-quiz');

    const totalPoints = parseFloat(article.dataset.examPoints) || 0;
    const scoringFields = fields.filter((_, idx) => answers[idx]);
    const pointsPerField = scoringFields.length > 0 ? totalPoints / scoringFields.length : 0;

    fields.forEach((field, idx) => {
      const correct = answers[idx];
      if (!correct) return;
      field.dataset.correct = correct;

      const inputs = field.querySelectorAll('input[type="radio"]');
      inputs.forEach((input) => {
        input.addEventListener('change', () => handleTfChange(field, input, correct, tfList, fasit, pointsPerField));
      });
    });
  }

  function handleTfChange(field, input, correct, tfList, fasit, pointsPerField) {
    if (field.classList.contains('is-answered')) return;
    field.classList.add('is-answered');

    const isCorrect = input.value === correct;
    field.classList.add(isCorrect ? 'is-correct' : 'is-wrong');

    field.querySelectorAll('input[type="radio"]').forEach((r) => {
      if (r !== input) r.disabled = true;
    });

    if (!field.querySelector('.exam-q__tf-status')) {
      const status = document.createElement('span');
      status.className = 'exam-q__tf-status';
      status.textContent = isCorrect ? '✓ Riktig' : '✗ Feil';
      field.appendChild(status);
    }

    if (isCorrect) addEarned(pointsPerField);

    const allAnswered = Array.from(tfList.querySelectorAll('.exam-q__tf-field'))
      .every((f) => f.classList.contains('is-answered'));
    if (allAnswered) {
      markAnswered();
      if (fasit && !fasit.open) fasit.open = true;
    }
  }

  /* ------------------ Åpne spørsmål (textarea + self-grade) ------------------ */

  function answerStorageKey(article) {
    const num = article.querySelector('.exam-q__num');
    const id = num ? num.textContent.trim().replace(/\s+/g, '_') : 'q';
    return `exam_answer::${location.pathname}::${id}`;
  }

  function setupAnswerBox(article) {
    if (article.querySelector('.exam-q__answer')) return;
    const body = article.querySelector('.exam-q__body');
    const fasit = article.querySelector('.fasit-details');
    if (!body || !fasit) return;

    const wrap = document.createElement('div');
    wrap.className = 'exam-q__answer';

    const head = document.createElement('div');
    head.className = 'exam-q__answer-head';
    const label = document.createElement('span');
    label.className = 'exam-q__answer-label';
    label.textContent = 'Skriv ditt svar';
    const meta = document.createElement('span');
    meta.className = 'exam-q__answer-meta';
    meta.textContent = '0 ord · 0 tegn';
    head.appendChild(label);
    head.appendChild(meta);

    const ta = document.createElement('textarea');
    ta.className = 'exam-q__answer-input';
    ta.rows = 8;
    ta.spellcheck = true;
    ta.placeholder = 'Formulér svaret ditt her før du folder ut modellsvaret. Teksten lagres lokalt i nettleseren.';

    const storageKey = answerStorageKey(article);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) ta.value = saved;
    } catch (e) {}

    const updateMeta = () => {
      const text = ta.value;
      const chars = text.length;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      meta.textContent = `${words} ord · ${chars} tegn`;
    };
    updateMeta();

    let saveTimer = null;
    ta.addEventListener('input', () => {
      updateMeta();
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        try { localStorage.setItem(storageKey, ta.value); } catch (e) {}
      }, 250);
    });

    wrap.appendChild(head);
    wrap.appendChild(ta);
    body.insertBefore(wrap, fasit);
  }

  function setupOpen(article) {
    const fasit = article.querySelector('.fasit-details');
    if (!fasit) return;
    const body = fasit.querySelector('.fasit-body');
    if (!body) return;
    if (body.querySelector('.exam-q__self')) return;

    setupAnswerBox(article);

    const points = parseFloat(article.dataset.examPoints) || 0;

    const wrap = document.createElement('div');
    wrap.className = 'exam-q__self';

    const label = document.createElement('span');
    label.className = 'exam-q__self-label';
    label.textContent = 'Hvor mye fikk du rett?';
    wrap.appendChild(label);

    SELF_GRADES.forEach((g) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'exam-q__self-btn';
      btn.dataset.factor = String(g.factor);
      btn.dataset.key = g.key;
      const pts = Math.round(points * g.factor * 10) / 10;
      btn.textContent = `${g.label} (${fmtPoints(pts)} p)`;
      btn.addEventListener('click', () => handleSelfGrade(wrap, btn, points));
      wrap.appendChild(btn);
    });

    body.appendChild(wrap);
  }

  function handleSelfGrade(wrap, btn, points) {
    if (wrap.classList.contains('is-answered')) return;
    wrap.classList.add('is-answered');

    Array.from(wrap.querySelectorAll('.exam-q__self-btn')).forEach((b) => {
      if (b === btn) b.classList.add('is-active');
    });

    const factor = parseFloat(btn.dataset.factor) || 0;
    const earned = Math.round(points * factor * 10) / 10;
    if (earned > 0) addEarned(earned);
    markAnswered();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
