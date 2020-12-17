const http = require("http");
const https = require("https");
const fs = require("fs");

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    (url.startsWith("https://") ? https : http)
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        fs.unlink(dest);
        reject(err);
      });
  });
}

module.exports = downloadFile;
