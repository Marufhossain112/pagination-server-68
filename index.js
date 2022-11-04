const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
// port
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

// checking
app.get("/", (req, res) => {
  res.send("I am running perfectfly...");
});
// listen
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
