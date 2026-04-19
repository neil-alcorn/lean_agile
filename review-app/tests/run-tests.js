const path = require("node:path");

try {
  require(path.join(__dirname, "review-app.test.js"));
  console.log("All review-app tests passed.");
} catch (error) {
  console.error(error);
  process.exit(1);
}
