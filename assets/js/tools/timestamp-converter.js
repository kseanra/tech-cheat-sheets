(function(){
  const unixInput = document.getElementById('unixInput');
  const unitSel = document.getElementById('unixUnit');
  const unixError = document.getElementById('unixError');
  const localOut = document.getElementById('outLocal');
  const utcOut = document.getElementById('outUtc');
  const isoOut = document.getElementById('outIso');
  const relativeOut = document.getElementById('outRelative');
  const btnNow = document.getElementById('btnNow');

  const humanInput = document.getElementById('humanInput');
  const humanOut = document.getElementById('outUnix');
  const humanError = document.getElementById('humanError');
  const btnUseNowHuman = document.getElementById('btnUseNowHuman');

  function relativeTime(ms){
    const diff = Math.round((ms - Date.now()) / 1000);
    const abs = Math.abs(diff);
    const units = [['year',31536000],['month',2592000],['day',86400],['hour',3600],['minute',60],['second',1]];
    for (const [name, secs] of units){
      if (abs >= secs || name === 'second'){
        const val = Math.round(abs / secs);
        return diff <= 0 ? val + ' ' + name + (val !== 1 ? 's' : '') + ' ago' : 'in ' + val + ' ' + name + (val !== 1 ? 's' : '');
      }
    }
  }

  function fromUnix(){
    unixError.classList.remove('visible');
    const raw = unixInput.value.trim();
    if (!raw){ localOut.textContent = utcOut.textContent = isoOut.textContent = relativeOut.textContent = ''; return; }
    const num = Number(raw);
    if (Number.isNaN(num)){
      unixError.textContent = 'Enter a numeric timestamp.';
      unixError.classList.add('visible');
      return;
    }
    const ms = unitSel.value === 'seconds' ? num * 1000 : num;
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())){
      unixError.textContent = 'That number is out of range for a valid date.';
      unixError.classList.add('visible');
      return;
    }
    localOut.textContent = d.toString();
    utcOut.textContent = d.toUTCString();
    isoOut.textContent = d.toISOString();
    relativeOut.textContent = relativeTime(ms);
  }

  function toUnix(){
    humanError.classList.remove('visible');
    const raw = humanInput.value;
    if (!raw){ humanOut.textContent = ''; return; }
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())){
      humanError.textContent = 'Could not parse that as a date.';
      humanError.classList.add('visible');
      return;
    }
    humanOut.textContent = 'seconds: ' + Math.floor(d.getTime() / 1000) + '\nmilliseconds: ' + d.getTime();
  }

  unixInput.addEventListener('input', fromUnix);
  unitSel.addEventListener('change', fromUnix);
  btnNow.addEventListener('click', () => {
    unitSel.value = 'seconds';
    unixInput.value = Math.floor(Date.now() / 1000);
    fromUnix();
  });

  humanInput.addEventListener('input', toUnix);
  btnUseNowHuman.addEventListener('click', () => {
    const now = new Date();
    now.setSeconds(0, 0);
    humanInput.value = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    toUnix();
  });

  btnNow.click();
})();
