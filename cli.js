const run = require("./src");

run()
  .then(() => {
    console.log(chalk.green("Files downloaded successfully"));
    process.exit(0);
  })
  .catch((error) => {
    console.log(chalk.red("Error occurred while downloading files"));
    console.log(chalk.red(`${error || "Unknown error"}`));
    process.exit(1);
  });
