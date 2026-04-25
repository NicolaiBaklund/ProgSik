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
    '<div class="chat-head"><h3>Studieassistent</h3><button class="close" aria-label="Lukk">×</button></div>' +
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
    var sec = null, best = Infinity;
    document.querySelectorAll('section[id]').forEach(function(s){
      var r = s.getBoundingClientRect();
      var d = Math.abs(r.top);
      if (r.bottom > 0 && d < best) { best = d; sec = s; }
    });
    var section = sec ? { id: sec.id, title: (sec.querySelector('h2')||{}).textContent || '' } : null;
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
          } catch (_) {}
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
