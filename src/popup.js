import { articleTemplate } from './templates.js';

function render() {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const currentTab = tabs[0];
        const escapedUrl = encodeURIComponent(currentTab.url);
        chrome.storage.local.get(escapedUrl, (data) => {
            document.getElementById('app').innerHTML = articleTemplate(data || []);
        });
    });
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    render();
}