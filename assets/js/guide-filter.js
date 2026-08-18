(function(){
  const cards = Array.from(document.querySelectorAll('.card'));
  const search = document.getElementById('search');
  const resultCount = document.getElementById('resultCount');
  const emptyState = document.getElementById('emptyState');

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
      const haystack = (card.dataset.search + ' ' + card.textContent).toLowerCase();
      const matches = !term || haystack.includes(term);
      card.classList.toggle('hidden', !matches);
      if (matches){
        visible++;
        if (term) highlight(card, term);
      }
    });

    emptyState.classList.toggle('hidden', visible !== 0);
    resultCount.textContent = term ? (visible + ' match' + (visible === 1 ? '' : 'es')) : '';
  }

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
