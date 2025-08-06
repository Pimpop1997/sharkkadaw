const iframes = document.querySelectorAll('.myIframe');
let fadeTimeout;

function makeFade() {
  iframes.forEach(iframe => iframe.classList.add('fade'));
}

function resetFadeTimer() {
  iframes.forEach(iframe => iframe.classList.remove('fade'));
  clearTimeout(fadeTimeout);
  fadeTimeout = setTimeout(makeFade, 10000);
}

['mousemove', 'keydown', 'mousedown', 'touchstart'].forEach(evt => {
  document.addEventListener(evt, resetFadeTimer);
});

resetFadeTimer();

// เพิ่มไว้ด้านบน main.js
const bgFiles = [
    'BG/BG.webp',
    'BG/BG2.webp'
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
  setInterval(changeBG, 10000);