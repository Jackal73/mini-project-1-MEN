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

export default router;
