const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ppr5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("hero-rider");
    const riderUserCollection = database.collection("rider-user");
    const learnerLessonCollection = database.collection("learner-lesson-user");
    const adminCollection = database.collection("admin");

    app.patch("/admin", async (req, res) => {
      const query = { email: req.body.email, password: req.body.password };
      const result = await adminCollection.findOne(query);
      res.json(result);
    });
    app.post("/admin", async (req, res) => {
      const body = req.body;
      const result = await adminCollection.insertOne({
        ...body,
        mainAdmin: true,
      });
      res.json(result);
    });

    app.get("/rider-user", async (req, res) => {
      const cursor = riderUserCollection.find();
      const result = await cursor.toArray();
      res.json(result);
    });
    app.get("/learner-lesson-user", async (req, res) => {
      const cursor = learnerLessonCollection.find();
      const result = await cursor.toArray();
      res.json(result);
    });
    app.post("/rider-user", async (req, res) => {
      const body = req.body;
      const result = await riderUserCollection.insertOne(body);
      res.json(result);
    });
    app.post("/learner-lesson-user", async (req, res) => {
      const body = req.body;
      console.log("hello");
      const result = await learnerLessonCollection.insertOne(body);
      res.json(result);
    });
    app.patch("/rider-user-block/:id", async (req, res) => {
      const id = req.params.id;
      const block = req.body.block;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          block: block,
        },
      };
      const options = { upsert: false };
      const result = await riderUserCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    app.patch("/lesson-learner-user-block/:id", async (req, res) => {
      const id = req.params.id;
      const block = req.body.block;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          block: block,
        },
      };
      const options = { upsert: false };
      const result = await learnerLessonCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Sorum Server");
});

app.listen(port, () => {
  console.log("Server running at port:", port);
});
