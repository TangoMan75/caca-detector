const pattern = /caca/i;
const htmlLines = document.documentElement.outerHTML.split('\n');
const matchedLines = [];

htmlLines.forEach((line, index) => {
  if (pattern.test(line)) {
    matchedLines.push({ index, line });
  }
});

if (matchedLines.length > 0) {
  const url = window.location.href;
  const timestamp = new Date().toISOString();
  chrome.runtime.sendMessage({ action: 'notify' });

  let entries = [];
  matchedLines.forEach(e => {
    entries.push({
      timestamp,
      url,
      index: e.index,
      content: e.line.trim()
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&sol;')
    });
  });

  const escapedUrl = encodeURIComponent(url);
  chrome.storage.local.set({ [escapedUrl]: entries });
}

function injectAnimation() {
  if (document.getElementById('caca-detector-animation')) return;
  const style = document.createElement('style');
  style.id = 'caca-detector-animation';
  style.textContent = `
  @keyframes pop {
    from { transform: scale(0); }
    to { transform: scale(1); }
  }
  @keyframes wobble {
    0% { transform: rotate(0deg); }
    88% { transform: rotate(0deg); }
    90% { transform: rotate(10deg); }
    92% { transform: rotate(-10deg); }
    94% { transform: rotate(15deg); }
    96% { transform: rotate(-15deg); }
    98% { transform: rotate(10deg); }
    100% { transform: rotate(-10deg); }
  }
  @keyframes zoomInBlur {
    from { opacity: 1; }
    to {
      transform: scale3d(3, 3, 3);
      opacity: 0;
    }
  }
  `;
  document.head.appendChild(style);
}

function injectImage() {
  if (document.getElementById('caca-detector-notification')) return;
  const img = document.createElement('img');
  img.id = 'caca-detector-notification';
  img.src = chrome.runtime.getURL('/images/pile_of_poo_notification.svg');
  img.style.position = 'fixed';
  img.style.top = '6rem';
  img.style.right = '3rem';
  img.style.width = '150px';
  img.style.zIndex = '10000';
  img.draggable = false;
  img.style.animation = 'pop 0.2s 1s ease-in';
  img.style.animationFillMode = 'both';

  img.addEventListener('animationend', function handler(e) {
    if (e.animationName === 'pop') {
      img.style.animation = 'wobble 5s linear infinite';
    }
    if (e.animationName === 'zoomInBlur') {
      img.remove();
    }
  });

  img.addEventListener('click', () => {
    img.style.animation = 'zoomInBlur 0.2s forwards';
  });

  document.body.appendChild(img);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'inject') {
    injectAnimation();
    injectImage();
  }
});