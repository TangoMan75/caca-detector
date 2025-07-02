describe('caca-detector content.js', () => {
  let sendMessageCalls, logCalls, storageSetCalls;

  beforeEach(() => {
    sendMessageCalls = [];
    storageSetCalls = [];
    global.chrome = {
      runtime: {
        sendMessage: (msg) => sendMessageCalls.push(msg),
        onMessage: {
          addListener: jest.fn()
        }
      },
      storage: {
        local: {
          set: (obj) => storageSetCalls.push(obj)
        }
      }
    };

    logCalls = [];
    global.console = { ...global.console, log: (msg) => logCalls.push(msg) };
    global.window = { location: { href: 'http://example.com' } };

  });

  async function runContentScriptWithHTML(html) {
    global.document = {
      documentElement: {
        outerHTML: html
      }
    };
    require('../src/content.js');
  }

  test('detects lines containing "caca" and sends a notification', async () => {
    const html = [
      '<html>',
      '<body>',
      '<div>hello caca world</div>',
      '<div>no match here</div>',
      '<div>CACA again</div>',
      '</body>',
      '</html>'
    ].join('\n');

    await runContentScriptWithHTML(html);

    expect(sendMessageCalls).toHaveLength(1);
    expect(sendMessageCalls[0]).toEqual({ action: 'notify' });

    expect(storageSetCalls).toHaveLength(1);
    const stored = storageSetCalls[0];
    const urlKey = encodeURIComponent('http://example.com');
    expect(stored[urlKey]).toBeDefined();
    expect(stored[urlKey]).toHaveLength(2);
    expect(stored[urlKey][0].index).toBe(2);
    expect(stored[urlKey][1].index).toBe(4);

  });

  test('does not send a notification if no match', async () => {
    const html = [
      '<html>',
      '<body>',
      '<div>hello world</div>',
      '<div>no match here</div>',
      '</body>',
      '</html>'
    ].join('\n');

    await runContentScriptWithHTML(html);

    expect(sendMessageCalls).toHaveLength(0);
    expect(storageSetCalls).toHaveLength(0);
  });
});