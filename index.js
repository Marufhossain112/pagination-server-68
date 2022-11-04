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

// connect with mongodb

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.efpjwcu.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

// listen
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
