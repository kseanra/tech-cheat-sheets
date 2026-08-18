(function(){
  const input = document.getElementById('b64Input');
  const output = document.getElementById('b64Output');
  const errorBox = document.getElementById('b64Error');
  const btnEncode = document.getElementById('btnEncode');
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

  function encode(){
    clearError();
    try {
      const bytes = new TextEncoder().encode(input.value);
      let binary = '';
      bytes.forEach(b => binary += String.fromCharCode(b));
      output.textContent = btoa(binary);
    } catch (err) {
      showError('Could not encode: ' + err.message);
    }
  }

  function decode(){
    clearError();
    const text = input.value.trim();
    if (!text) { showError('Paste some Base64 first.'); return; }
    try {
      const binary = atob(text);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      output.textContent = new TextDecoder().decode(bytes);
    } catch (err) {
      showError('Not valid Base64 — check for missing padding or invalid characters.');
    }
  }

  btnEncode.addEventListener('click', encode);
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

  if (window.TOOL_DEFAULT_MODE === 'decode') decode(); else if (input.value) encode();
})();
