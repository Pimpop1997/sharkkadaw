// --- Dynamic iframe popup preview ---
document.addEventListener('DOMContentLoaded', function() {
  // Modal structure
  let modal = document.createElement('div');
  modal.id = 'iframe-modal';
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgba(0,0,0,0.7)';
  modal.style.zIndex = '9999';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.innerHTML = '<div id="iframe-modal-content" style="position:relative;max-width:90vw;max-height:90vh;display:flex;flex-direction:column;align-items:center;justify-content:center;"></div>';
  document.body.appendChild(modal);

  function showModal(iframeUrl) {
    const content = modal.querySelector('#iframe-modal-content');
    // Use srcdoc skeleton instant paint, then swap to src when visible
    const skeleton = `<div style="display:flex;align-items:center;justify-content:center;width:80vw;height:70vh;border-radius:12px;background:#111;border:0;box-shadow:0 2px 24px #0009;">
        <div style="width:36px;height:36px;border-radius:50%;border:3px solid #fff3;border-top-color:#fff;animation:spin 0.9s linear infinite"></div>
      </div>`;
    content.innerHTML = '<button id="close-iframe-modal" style="position:absolute;top:10px;right:10px;font-size:2rem;background:#fff;border:none;border-radius:50%;width:40px;height:40px;cursor:pointer;z-index:2;">×</button>' +
      skeleton;
    const iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.className = 'myIframe';
    iframe.style.cssText = 'width:80vw;height:70vh;border-radius:12px;border:0;box-shadow:0 2px 24px #0009;z-index:1;';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    // defer insertion to next frame so skeleton shows instantly
    requestIdleCallback ? requestIdleCallback(() => content.appendChild(iframe)) : setTimeout(() => content.appendChild(iframe), 0);
    modal.style.display = 'flex';
    document.getElementById('close-iframe-modal').onclick = function() {
      modal.style.display = 'none';
      content.innerHTML = '';
    };
  }

  document.querySelectorAll('.preview-box').forEach(function(box) {
    box.addEventListener('click', function(e) {
      // ไม่ให้คลิกที่ลิงก์ด้านใน grid เปิดป๊อปอัพ
      if (e.target.closest('a')) return;
      const iframeUrl = box.getAttribute('data-iframe');
      if (iframeUrl) showModal(iframeUrl);
    });
  });
});

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker failed', err));
  });
}

// เพิ่มไว้ด้านบน main.js
const bgFiles = [
    'BG/BG.jpg',
    // เพิ่มชื่อไฟล์ได้ตามต้องการ
];
  
  let current = 0;
  
  function changeBG() {
    document.body.style.backgroundImage = `url('${bgFiles[current]}')`;
    document.body.style.backgroundSize = 'auto';
    document.body.style.backgroundPosition = 'center';
    document.body.style.transition = 'background-image 1s ease';
    current = (current + 1) % bgFiles.length;
  }
  
  // เริ่มต้นแสดงภาพแรก
  changeBG();
  // เปลี่ยนช้าลงมากอยู่แล้ว แต่อย่า block main thread
  setInterval(changeBG, 10000000);

  document.addEventListener('DOMContentLoaded', function() {
    const marqueeBox = document.getElementById('marquee-box');
    if (marqueeBox) {
      marqueeBox.addEventListener('click', function() {
        window.open('./test.html', '_blank');
      });
    }
  });
  document.addEventListener('DOMContentLoaded', function() {
    // เลือกทุก .preview-box.animated
    document.querySelectorAll('.preview-box.animated').forEach(function(box) {
      // สุ่ม delay ระหว่าง 0 ถึง 1.2 วินาที (หรือมากกว่านี้ก็ได้)
      const delay = Math.random() * 1.2;
      box.style.animationDelay = delay + 's';
    });
    // Lazy attrs for preview images (safety net if HTML misses it)
    document.querySelectorAll('img.preview-img').forEach(img => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
      if (!img.getAttribute('width')) img.setAttribute('width', '195');
      if (!img.getAttribute('height')) img.setAttribute('height', '195');
    });
    // Keyframe for spinner (injected once)
    (function ensureSpinnerKeyframes(){
      if (document.getElementById('spin-style')) return;
      const s = document.createElement('style');
      s.id = 'spin-style';
      s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(s);
    })();
  });