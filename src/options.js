import { articleTemplate } from './templates.js';

function initClearButtonEventListener() {
    const button = document.getElementById('clear');
    if (button) {
        button.addEventListener('click', () => {
            chrome.storage.local.clear(() => {
                render();
            });
        });
    }
}

function render() {
    chrome.storage.local.get(null, (data) => {
        const button = document.getElementById('clear');
        if (!data || Object.values(data).length === 0) {
            if (button) button.setAttribute('disabled', 'true');
            document.getElementById('app').innerHTML = '';
            return;
        };
        if (button) button.removeAttribute('disabled');
        document.getElementById('app').innerHTML = articleTemplate(data || []);
    });
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    initClearButtonEventListener();
    render();
}