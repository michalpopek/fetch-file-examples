const path = require("path");
const assert = require("assert");
const chalk = require("chalk");
const getDownloadTargets = require("./get-download-targets");
const downloadFile = require("./download-file");

const URL = "https://file-examples.com/";

async function run() {
  const targets = await getDownloadTargets(URL);
  const downloadPath = process.cwd()
  await Promise.all(
    targets.map(async (target) => {
      const [filename] = target.split("/").slice(-1);
      assert(
        typeof filename === "string",
        `Filename should be a string, got ${filename} from ${target}`
      );
      assert(filename, "Filename cannot be empty");
      const destination = path.join(downloadPath, filename);
      await downloadFile(target, destination);
      console.log(chalk.blue(`Downloaded ${filename} to ${destination}`));
    })
  );
}

module.exports = run;
