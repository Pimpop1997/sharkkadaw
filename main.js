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
    content.innerHTML = '<button id="close-iframe-modal" style="position:absolute;top:10px;right:10px;font-size:2rem;background:#fff;border:none;border-radius:50%;width:40px;height:40px;cursor:pointer;z-index:2;">×</button>' +
      `<iframe src="${iframeUrl}" class="myIframe" style="width:80vw;height:70vh;border-radius:12px;border:0;box-shadow:0 2px 24px #0009;z-index:1;" allowfullscreen loading="lazy"></iframe>`;
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
  // เปลี่ยนทุก 30 วินาที
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
  });