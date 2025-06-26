const pattern = /caca)/i;
const htmlLines = document.documentElement.outerHTML.split('\n');
const matchedLines = [];

htmlLines.forEach((line, index) => {
  if (pattern.test(line)) {
    matchedLines.push(index + 1); // Line numbers are 1-based
  }
});

if (matchedLines.length > 0) {
  chrome.runtime.sendMessage({ action: 'notify', lines: matchedLines });
  matchedLines.forEach(e => {
    console.log('Caca found on line: ' + e);
  });
}