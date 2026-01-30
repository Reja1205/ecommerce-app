require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = 4000;

connectDB();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
