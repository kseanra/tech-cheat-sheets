(function(){
  const input = document.getElementById('jwtInput');
  const headerOut = document.getElementById('jwtHeader');
  const payloadOut = document.getElementById('jwtPayload');
  const sigOut = document.getElementById('jwtSignature');
  const errorBox = document.getElementById('jwtError');
  const btnClear = document.getElementById('btnClear');
  const btnSample = document.getElementById('btnSample');

  const SAMPLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  function base64UrlDecode(str){
    let s = str.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    const binary = atob(s);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function clearOut(){
    headerOut.textContent = '';
    payloadOut.textContent = '';
    sigOut.textContent = '';
  }

  function decode(){
    const token = input.value.trim();
    errorBox.classList.remove('visible');
    clearOut();
    if (!token) return;

    const parts = token.split('.');
    if (parts.length !== 3) {
      errorBox.textContent = 'A JWT has 3 dot-separated parts (header.payload.signature) — found ' + parts.length + '.';
      errorBox.classList.add('visible');
      return;
    }

    try {
      headerOut.textContent = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2);
    } catch (err) {
      errorBox.textContent = 'Could not decode header: ' + err.message;
      errorBox.classList.add('visible');
      return;
    }
    try {
      payloadOut.textContent = JSON.stringify(JSON.parse(base64UrlDecode(parts[1])), null, 2);
    } catch (err) {
      errorBox.textContent = 'Could not decode payload: ' + err.message;
      errorBox.classList.add('visible');
      return;
    }
    sigOut.textContent = parts[2];
  }

  input.addEventListener('input', decode);
  btnClear.addEventListener('click', () => { input.value = ''; clearOut(); errorBox.classList.remove('visible'); input.focus(); });
  btnSample.addEventListener('click', () => { input.value = SAMPLE; decode(); });

  decode();
})();
