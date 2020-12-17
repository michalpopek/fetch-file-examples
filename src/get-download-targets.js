const assert = require("assert");
const puppeteer = require("puppeteer");

async function getDownloadTargets(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const links = await page.$$eval("#features .btn-orange", (buttons) =>
    buttons.map((b) => b.href)
  );

  assert(links.length, "No main links found");

  const result = await Promise.all(
    links.map(async (link) => {
      const tab = await browser.newPage();

      const traverse = async (p, u) => {
        await p.goto(u);

        const result = await p.evaluate(() => {
          const downloads = [];
          const remaining = [];
          const buttons = Array.from(document.querySelectorAll(".btn-orange"));
          for (const button of buttons) {
            const { href } = button;
            if (button.classList.contains("download-button")) {
              downloads.push(href);
            } else {
              remaining.push(href);
            }
          }
          return { downloads, remaining };
        });

        const childDownloads = await Promise.all(
          result.remaining.map(async (href) => {
            const sb = await browser.newPage();
            const downloads = await traverse(sb, href);
            await sb.close();
            return downloads;
          })
        );

        return result.downloads.concat(...childDownloads);
      };

      const downloads = await traverse(tab, link);
      await tab.close();
      return downloads;
    })
  );

  return result.flat();
}

module.exports = getDownloadTargets;
