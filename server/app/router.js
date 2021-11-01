import Router from "express";
import config from "./config.js";
import client from "./db/connections/client.js";

const collection = client.db(config.db.name).collection(config.db.collection);

const router = new Router();

// localhost:3000/api
router.get("/", (_, res) => {
  res.send("Hello World from API router!");
});

// localhost:3000/api/sample_airbnb
router.get("/sample_airbnb", async (_, res) => {
  // Get all of the sample_airbnb
  const sampleAirbnb = await collection.find().limit(2).toArray();
  res.json(sampleAirbnb);
});

// localhost:3000/api/sample_airbnb/current listings

// localhost:3000/api/sample_airbnb/:id
router.get("/sample_airbnb/:id", async (req, res) => {
  const airbnbListing = await collection.findOne({ _id: req.body.id });
  res.json(airbnbListing);
});
export default router;
