const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const app = require("./src/app");
const connectDB = require("./src/db/db");

async function startServer() {
  try {
    await connectDB();
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    // Avoid dumping connection objects that may contain credentials.
    console.error("Database startup failed:", error.name);
    if (error.code) console.error("Error code:", error.code);
    if (error.syscall) console.error("Failed operation:", error.syscall);
    console.error(
      "Check MONGO_URI, Atlas IP access list, cluster status, and outbound access to port 27017."
    );
    process.exit(1);
  }
}

startServer();
