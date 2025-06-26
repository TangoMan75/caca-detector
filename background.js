chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'notify' && sender.tab && sender.tab.id) {
    chrome.action.setIcon({
      tabId: sender.tab.id,
      path: '/images/pile_of_poo_notification.png'
    });
  }
});