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
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// set up the base function
async function run() {
  try {
    const productCollection = client.db("emaJohn").collection("products");
    // api for getting the data to client from database
    app.get("/products", async (req, res) => {
      const query = {};
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page, size);
      const cursor = productCollection.find(query);
      const products = await cursor
        .skip(page * size)
        .limit(size)
        .toArray();
      const count = await productCollection.estimatedDocumentCount();
      //   console.log(count);
      res.send({ count, products });
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

// listen
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
