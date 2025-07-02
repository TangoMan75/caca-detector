if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'notify' && sender.tab && sender.tab.id) {
      if (typeof chrome !== 'undefined' && chrome.action && chrome.action.setIcon) {
        chrome.action.setIcon({
          tabId: sender.tab.id,
          path: '/images/pile_of_poo_notification.png'
        });
      }
      if (chrome.tabs && chrome.tabs.sendMessage) {
        chrome.tabs.sendMessage(sender.tab.id, { action: 'inject' });
      }
    }
  });
}