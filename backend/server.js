
const path = require("node:path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const app = require("./src/app");
const connectDB = require("./src/db/db");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database startup failed:", error.name);
    process.exit(1);
  }
}

// Start the server only during direct execution
if (require.main === module) {
  startServer();
}

module.exports = app;
