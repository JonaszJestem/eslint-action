const https = require("https");

const request = (url, options): Promise<{ data; res: unknown }> =>
  new Promise((resolve, reject) => {
    const req = https
      .request(url, options, res => {
        let data = "";
        res.on("data", chunk => {
          data += chunk;
        });
        res.on("end", () => {
          if (res.statusCode >= 400) {
            const err = new Error(`Received status code ${res.statusCode}`);
            reject({ ...err, response: res, data });
          } else {
            resolve({ res, data: JSON.parse(data) });
          }
        });
      })
      .on("error", reject);
    if (options.body) {
      req.end(JSON.stringify(options.body));
    } else {
      req.end();
    }
  });

export default request;
