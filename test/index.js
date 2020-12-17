const path = require("path");
const fs = require("fs/promises");
const { W_OK } = require("fs");
const chalk = require("chalk");
const run = require("../src");

async function test() {
  const cwd = process.cwd();
  const target = path.join(__dirname, "downloads");

  try {
    await fs.access(target, W_OK);
    await fs.rm(target, { recursive: true, force: true });
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  await fs.mkdir(target);

  try {
    process.chdir(target);
    await run();
  } finally {
    process.chdir(cwd);
  }
}

test()
  .then(() => {
    console.log(chalk.green("Test succeeded"));
    process.exit(0);
  })
  .catch((error) => {
    console.log(chalk.red("Test failed"));
    console.log(chalk.red(error));
    process.exit(1);
  });
