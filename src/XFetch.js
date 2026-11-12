export const XFetch = {
  post: async (url, data, headers = {}) => {
    return new Promise((resolve) => {
      GM.xmlHttpRequest({
        method: 'POST',
        url,
        headers,
        data,
        onload: (res) => {
          resolve({
            json: async () => JSON.parse(res.responseText),
            text: async () => res.responseText,
            headers: async () =>
              Object.fromEntries(
                res.responseHeaders.split('\r\n').map((h) => h.split(': '))
              ),
            raw: res,
          });
        },
      });
    });
  },
  get: async (url, headers = {}) => {
    return new Promise((resolve) => {
      GM.xmlHttpRequest({
        method: 'GET',
        url,
        headers: {
          Accept: 'application/json',
          ...headers,
        },
        onload: (res) => {
          resolve({
            json: async () => JSON.parse(res.responseText),
            text: async () => res.responseText,
            headers: async () =>
              Object.fromEntries(
                res.responseHeaders.split('\r\n').map((h) => h.split(': '))
              ),
            raw: res,
          });
        },
      });
    });
  },
};
