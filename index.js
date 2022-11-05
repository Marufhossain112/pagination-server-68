const jwt = require("jsonwebtoken");
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

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    // creating api in the server for jwt token
    app.post("/jwt", (req, res) => {
      const user = req.body;
      // console.log(user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token }); /* {} for converting to the object */
    });

    // orders api
    app.get("/orders", async (req, res) => {
      console.log(req.headers.authorization);
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = productCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

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
    app.post("/productsByIds", async (req, res) => {
      const ids = req.body;
      console.log(ids);
      const objectIds = ids.map((id) => ObjectId(id));
      const query = { _id: { $in: objectIds } };
      // const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

// listen
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
