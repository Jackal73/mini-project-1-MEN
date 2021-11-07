import Router from "express";
import config from "./config.js";
import client from "./db/connections/client.js";

const collection = client.db(config.db.name).collection(config.db.collection);

const router = new Router();

// Test - Get hello world
router.get("/", (_, res) => {
  res.send("Hello World from API router!");
});

// Get current listings
router.get("/current-listings", async (_, res) => {
  // Get all of the sample_airbnb
  const currentList = await collection.find({}).limit(5).toArray();
  res.json(currentList);
});

export default router;
