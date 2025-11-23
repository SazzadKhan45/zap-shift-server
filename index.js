const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

//
const uri = process.env.URI;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    //
    const db = client.db("Zap-shift-db");
    const parcelsCollections = db.collection("Parcels");

    // Parcels api list ---------------------
    // Parcel Post Api
    app.post("/parcels", async (req, res) => {
      try {
        const parcel = req.body;

        // Validate input (optional but recommended)
        if (!parcel) {
          return res.status(400).send({ message: "Invalid parcel data" });
        }

        const result = await parcelsCollections.insertOne(parcel);

        res.status(201).send({
          message: "Parcel data successfully store",
          data: result,
        });
      } catch (error) {
        console.error("Error creating parcel:", error);
        res.status(500).send({
          message: "Failed to create parcel",
          error: error.message,
        });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
