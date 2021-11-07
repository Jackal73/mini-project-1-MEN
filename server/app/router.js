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
  // Get all of the sample_airbnb listings
  const currentList = await collection.find({}).limit(5).toArray();
  res.json(currentList);
});

// Get listing by id
router.get("/:id", async (req, res) => {
  const listingById = await collection.findOne({ _id: req.body.id });
  res.json(listingById);
});

// Update a single airbnb listing
router.put("/listings/:id", async (req, res) => {
  const updateList = await collection.updateOne(
    { _id: req.body.id },
    { $set: req.body.payload }
  );
  res.json(updateList);
});

// Add a new listing
router.post("/listings", async (req, res) => {
  const addListing = await collection.insertOne(req.body);
  res.json(addListing);
  console.log(
    `New listing created with the following id: ${addListing.insertedId}`
  );
});

// Delete a single listing
router.delete("/listings/:id", async (req, res) => {
  const delList = await collection.deleteOne({ _id: req.body.id });
  // console.log(`Listing id: ${delList.deletedId} was deleted`);
  res.json(delList);
});

export default router;
