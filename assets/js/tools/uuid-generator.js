(function(){
  const output = document.getElementById('uuidOutput');
  const countInput = document.getElementById('uuidCount');
  const upperCheck = document.getElementById('uuidUpper');
  const hyphenCheck = document.getElementById('uuidHyphens');
  const btnGenerate = document.getElementById('btnGenerate');
  const btnCopy = document.getElementById('btnCopy');

  function generateOne(){
    let id = crypto.randomUUID();
    if (!hyphenCheck.checked) id = id.replace(/-/g, '');
    if (upperCheck.checked) id = id.toUpperCase();
    return id;
  }

  function generate(){
    const count = Math.min(Math.max(parseInt(countInput.value, 10) || 1, 1), 100);
    countInput.value = count;
    const ids = [];
    for (let i = 0; i < count; i++) ids.push(generateOne());
    output.textContent = ids.join('\n');
  }

  btnGenerate.addEventListener('click', generate);
  upperCheck.addEventListener('change', generate);
  hyphenCheck.addEventListener('change', generate);
  btnCopy.addEventListener('click', () => {
    if (!output.textContent) return;
    navigator.clipboard.writeText(output.textContent).then(() => {
      const original = btnCopy.textContent;
      btnCopy.textContent = 'copied';
      setTimeout(() => { btnCopy.textContent = original; }, 1400);
    });
  });

  generate();
})();
