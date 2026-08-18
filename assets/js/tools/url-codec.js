(function(){
  const input = document.getElementById('urlInput');
  const output = document.getElementById('urlOutput');
  const errorBox = document.getElementById('urlError');
  const btnEncode = document.getElementById('btnEncode');
  const btnEncodeFull = document.getElementById('btnEncodeFull');
  const btnDecode = document.getElementById('btnDecode');
  const btnSwap = document.getElementById('btnSwap');
  const btnCopy = document.getElementById('btnCopy');
  const btnClear = document.getElementById('btnClear');

  function showError(msg){
    errorBox.textContent = msg;
    errorBox.classList.add('visible');
    output.textContent = '';
  }
  function clearError(){ errorBox.classList.remove('visible'); }

  function encodeComponent(){
    clearError();
    output.textContent = encodeURIComponent(input.value);
  }
  function encodeFullUri(){
    clearError();
    output.textContent = encodeURI(input.value);
  }
  function decode(){
    clearError();
    const text = input.value.trim();
    if (!text) { showError('Paste an encoded URL or string first.'); return; }
    try {
      output.textContent = decodeURIComponent(text);
    } catch (err) {
      showError('Not valid percent-encoding — check for a stray "%" not followed by two hex digits.');
    }
  }

  btnEncode.addEventListener('click', encodeComponent);
  if (btnEncodeFull) btnEncodeFull.addEventListener('click', encodeFullUri);
  btnDecode.addEventListener('click', decode);
  btnSwap.addEventListener('click', () => {
    const tmp = input.value;
    input.value = output.textContent;
    output.textContent = tmp;
    clearError();
  });
  btnClear.addEventListener('click', () => {
    input.value = '';
    output.textContent = '';
    clearError();
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

  if (window.TOOL_DEFAULT_MODE === 'decode') decode(); else if (input.value) encodeComponent();
})();
