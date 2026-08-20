(function(){
  function pushIfVisible(ins){
    if (ins.dataset.adsPushed) return;
    if (ins.offsetWidth > 0){
      ins.dataset.adsPushed = '1';
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {}
    }
  }

  function initAds(){
    document.querySelectorAll('ins.adsbygoogle').forEach(pushIfVisible);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initAds);
  } else {
    initAds();
  }
})();
