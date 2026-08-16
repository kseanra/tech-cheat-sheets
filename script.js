(function(){
  const cards = Array.from(document.querySelectorAll('.card'));
  const tabs = Array.from(document.querySelectorAll('.tab-btn'));
  const search = document.getElementById('search');
  const resultCount = document.getElementById('resultCount');
  const emptyState = document.getElementById('emptyState');
  const sectionHead = document.getElementById('sectionHead');
  const sectionSub = document.getElementById('sectionSub');

  const catLabels = {
    all: ['All references', 'Every snippet, table and command on this page — filter with the grep bar or a category tab.'],
    css: ['CSS', 'Layout and styling patterns worth keeping within arm’s reach.'],
    js: ['JavaScript', 'Core language and browser-API patterns used in most day-to-day code.'],
    python: ['Python', 'Idiomatic patterns that show up in almost every script or service.'],
    cli: ['CLI & Git', 'Commands typed often enough to outlive any GUI wrapper.'],
    api: ['API reference', 'Status codes and REST verbs, the vocabulary of every HTTP API.'],
    markdown: ['Markdown syntax', 'The full syntax table for READMEs, docs and chat formatting.']
  };

  // populate per-category counts once
  function updateCounts(){
    const counts = { all: cards.length };
    cards.forEach(c => {
      const cat = c.dataset.cat;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    Object.keys(counts).forEach(cat => {
      const el = document.getElementById('count-' + cat);
      if (el) el.textContent = counts[cat];
    });
  }
  updateCounts();

  let activeCat = 'all';

  function stripHighlights(el){
    el.querySelectorAll('mark').forEach(m => {
      m.replaceWith(document.createTextNode(m.textContent));
    });
  }

  function highlight(el, term){
    if(!term) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    const re = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'ig');
    nodes.forEach(node => {
      if (!node.nodeValue.match(re)) return;
      const span = document.createElement('span');
      span.innerHTML = node.nodeValue.replace(re, '<mark>$1</mark>');
      node.replaceWith(span);
    });
  }

  function applyFilters(){
    const term = search.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach(card => {
      stripHighlights(card);
      const matchesCat = activeCat === 'all' || card.dataset.cat === activeCat;
      const haystack = (card.dataset.search + ' ' + card.textContent).toLowerCase();
      const matchesTerm = !term || haystack.includes(term);
      const show = matchesCat && matchesTerm;
      card.classList.toggle('hidden', !show);
      if (show){
        visible++;
        if (term) highlight(card, term);
      }
    });

    emptyState.classList.toggle('hidden', visible !== 0);
    resultCount.textContent = term ? (visible + ' match' + (visible === 1 ? '' : 'es')) : '';
  }

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      const [head, sub] = catLabels[activeCat];
      sectionHead.textContent = head;
      sectionSub.textContent = sub;
      applyFilters();
    });
  });

  search.addEventListener('input', applyFilters);

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.card');
      const codeBlock = card.querySelector('pre');
      const text = codeBlock ? codeBlock.textContent : card.querySelector('table').innerText;
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = 'copied';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = original; btn.classList.remove('copied'); }, 1400);
      }).catch(() => {
        btn.textContent = 'error';
        setTimeout(() => { btn.textContent = 'copy'; }, 1400);
      });
    });
  });

  // keyboard shortcut: "/" focuses the search bar, like GitHub
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== search){
      e.preventDefault();
      search.focus();
    }
  });

  applyFilters();
})();
