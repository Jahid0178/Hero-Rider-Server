const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ppr5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("heroRider");
    const riderCollection = database.collection("rider-information");
    const learnerCollection = database.collection(
      "driving-learner-information"
    );

    // POST Rider information API
    app.post("/riderInfo", async (req, res) => {
      const riderData = req.body;
      const result = await riderCollection.insertOne(riderData);
      res.json(result);
    });

    // POST Driving lesson learner API
    app.post("/drivingLessonLearner", async (req, res) => {
      const drivingLearnerData = req.body;
      const result = await learnerCollection.insertOne(drivingLearnerData);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running hero rider server");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
