describe('background.js', () => {
  beforeEach(() => {
    global.chrome = {
      action: {
        setIcon: jest.fn()
      },
      runtime: {
        onMessage: {
          addListener: jest.fn()
        }
      },
      tabs: {
        sendMessage: jest.fn()
      }
    };
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('onMessage listener calls changeIcon and sendMessage', () => {
    require('../src/background');
    const addListener = global.chrome.runtime.onMessage.addListener;
    expect(addListener).toHaveBeenCalledTimes(1);
    const listener = addListener.mock.calls[0][0];

    const sender = { tab: { id: 456 } };
    const message = { action: 'notify' };
    listener(message, sender, jest.fn());

    expect(global.chrome.action.setIcon).toHaveBeenCalledWith({
      tabId: 456,
      path: '/images/pile_of_poo_notification.png'
    });
    expect(global.chrome.tabs.sendMessage).toHaveBeenCalledWith(456, { action: 'inject' });
  });

  test('onMessage listener does nothing if action is not notify', () => {
    require('../src/background');
    const addListener = global.chrome.runtime.onMessage.addListener;
    expect(addListener).toHaveBeenCalledTimes(1);
    const listener = addListener.mock.calls[0][0];
    const sender = { tab: { id: 789 } };
    const message = { action: 'other' };
    listener(message, sender, jest.fn());
    expect(global.chrome.action.setIcon).not.toHaveBeenCalled();
    expect(global.chrome.tabs.sendMessage).not.toHaveBeenCalled();
  });

  test('onMessage listener does nothing if sender.tab.id is missing', () => {
    require('../src/background');
    const addListener = global.chrome.runtime.onMessage.addListener;
    expect(addListener).toHaveBeenCalledTimes(1);
    const listener = addListener.mock.calls[0][0];
    const sender = { tab: {} };
    const message = { action: 'notify' };
    listener(message, sender, jest.fn());
    expect(global.chrome.action.setIcon).not.toHaveBeenCalled();
    expect(global.chrome.tabs.sendMessage).not.toHaveBeenCalled();
  });
});
