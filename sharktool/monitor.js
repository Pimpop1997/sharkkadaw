(function(){
  // SharkTool Monitor (minimal, safe)
  const ID = 'sharktool-monitor-panel';
  if (document.getElementById(ID)) return; // prevent duplicate

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    #${ID}{position:fixed;bottom:20px;right:20px;z-index:2147483647;width:320px;background:#0b1220;color:#e2e8f0;border:1px solid #334155;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.4);font:13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
    #${ID} header{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-bottom:1px solid #1f2a44}
    #${ID} header .ttl{font-weight:700;display:flex;gap:6px;align-items:center}
    #${ID} .body{padding:8px;display:flex;flex-direction:column;gap:6px}
    #${ID} .row{display:flex;gap:8px;align-items:center}
    #${ID} .kv{display:flex;gap:6px;flex-wrap:wrap;color:#93c5fd}
    #${ID} .log{height:140px;overflow:auto;white-space:pre-wrap;background:#0f172a;border:1px dashed #334155;border-radius:8px;padding:6px;color:#93c5fd}
    #${ID} button{background:#334155;color:#e2e8f0;border:none;border-radius:8px;padding:6px 10px;cursor:pointer}
  `;
  document.head.appendChild(style);

  // Panel
  const el = document.createElement('div');
  el.id = ID;
  el.innerHTML = `
    <header>
      <div class="ttl">🦈 Monitor</div>
      <div>
        <button id="stm-min">↕</button>
        <button id="stm-close">ปิด</button>
      </div>
    </header>
    <div class="body">
      <div class="kv">
        <div>URL: <b>${location.href}</b></div>
        <div>| Online: <b id="stm-online">${navigator.onLine}</b></div>
        <div>| SW: <b id="stm-sw">…</b></div>
      </div>
      <div class="row">
        <button id="stm-clear">ล้าง Log</button>
        <button id="stm-ping">Ping</button>
        <span id="stm-ping-res" style="color:#a7f3d0"></span>
      </div>
      <div id="stm-log" class="log"></div>
    </div>
  `;
  document.body.appendChild(el);

  const logEl = el.querySelector('#stm-log');
  function line(msg){ logEl.textContent += (new Date()).toLocaleTimeString()+" "+msg+"\n"; logEl.scrollTop = logEl.scrollHeight; }

  // Basic info
  line('เริ่มทำงาน Monitor');
  line('UA: ' + navigator.userAgent);

  // Online status
  function updOnline(){ el.querySelector('#stm-online').textContent = navigator.onLine; }
  window.addEventListener('online', updOnline);
  window.addEventListener('offline', updOnline);

  // Service worker status
  (async function(){
    try{
      if ('serviceWorker' in navigator) {
        const r = await navigator.serviceWorker.getRegistrations();
        el.querySelector('#stm-sw').textContent = r.length ? 'registered(' + r.length + ')' : 'none';
      } else {
        el.querySelector('#stm-sw').textContent = 'unsupported';
      }
    }catch(e){ el.querySelector('#stm-sw').textContent = 'error'; }
  })();

  // Ping
  el.querySelector('#stm-ping').onclick = async () => {
    try{
      const t0 = performance.now();
      const r = await fetch(location.href, { method:'HEAD', cache:'no-store' });
      const t1 = performance.now();
      el.querySelector('#stm-ping-res').textContent = `${Math.round(t1-t0)} ms (${r.status})`;
      line('Ping OK ' + Math.round(t1-t0) + ' ms');
    }catch(e){
      el.querySelector('#stm-ping-res').textContent = 'ERR';
      line('Ping ERR ' + e);
    }
  };

  // Clear
  el.querySelector('#stm-clear').onclick = () => { logEl.textContent = ''; };

  // Minimize/Close
  let minimized = false;
  el.querySelector('#stm-min').onclick = () => {
    minimized = !minimized;
    el.querySelector('.body').style.display = minimized ? 'none' : '';
  };
  el.querySelector('#stm-close').onclick = () => { el.remove(); style.remove(); };
})();
