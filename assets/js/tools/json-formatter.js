(function(){
  const input = document.getElementById('jsonInput');
  const output = document.getElementById('jsonOutput');
  const errorBox = document.getElementById('jsonError');
  const okBox = document.getElementById('jsonOk');
  const indentSel = document.getElementById('jsonIndent');
  const btnFormat = document.getElementById('btnFormat');
  const btnMinify = document.getElementById('btnMinify');
  const btnCopy = document.getElementById('btnCopy');
  const btnClear = document.getElementById('btnClear');

  function showError(msg){
    errorBox.textContent = msg;
    errorBox.classList.add('visible');
    okBox.classList.remove('visible');
    output.textContent = '';
  }

  function showOk(msg){
    okBox.textContent = msg;
    okBox.classList.add('visible');
    errorBox.classList.remove('visible');
  }

  function locateError(text, err){
    const match = /position (\d+)/.exec(err.message);
    if (!match) return err.message;
    const pos = parseInt(match[1], 10);
    const upToError = text.slice(0, pos);
    const line = (upToError.match(/\n/g) || []).length + 1;
    const col = pos - upToError.lastIndexOf('\n');
    return err.message + ' (line ' + line + ', column ' + col + ')';
  }

  function parseInput(){
    const text = input.value.trim();
    if (!text) throw new Error('Paste some JSON first.');
    try {
      return JSON.parse(text);
    } catch (err) {
      throw new Error(locateError(text, err));
    }
  }

  function format(){
    try {
      const data = parseInput();
      const indent = indentSel.value === 'tab' ? '\t' : parseInt(indentSel.value, 10);
      output.textContent = JSON.stringify(data, null, indent);
      showOk('Valid JSON.');
    } catch (err) {
      showError(err.message);
    }
  }

  function minify(){
    try {
      const data = parseInput();
      output.textContent = JSON.stringify(data);
      showOk('Valid JSON.');
    } catch (err) {
      showError(err.message);
    }
  }

  btnFormat.addEventListener('click', format);
  btnMinify.addEventListener('click', minify);
  btnClear.addEventListener('click', () => {
    input.value = '';
    output.textContent = '';
    errorBox.classList.remove('visible');
    okBox.classList.remove('visible');
    input.focus();
  });
  btnCopy.addEventListener('click', () => {
    if (!output.textContent) return;
    navigator.clipboard.writeText(output.textContent).then(() => {
      const original = btnCopy.textContent;
      btnCopy.textContent = 'copied';
      setTimeout(() => { btnCopy.textContent = original; }, 1400);
    });
  });
})();
