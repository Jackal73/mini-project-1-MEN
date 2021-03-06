import Router from "express";
import config from "./config.js";
import client from "./db/connections/client.js";

const collection = client.db(config.db.name).collection(config.db.collection);

const router = new Router();

// Using "Insomnia" API client for route testing.

// Test - Get hello world
router.get("/", (_, res) => {
  res.send("Hello World from API router!");
});

// Get current listings
router.get("/current-listings", async (_, res) => {
  // Get all of the sample_airbnb listings - (limited to 5 listings)
  const currentList = await collection.find({}).limit(5).toArray();
  res.json(currentList);
});

// ***--- Still working on this one ---***
// Get current listings with params - ( keywords, max-price, # of listings shown)
router.get("/current-listings", async (req, res) => {
  const filter = Object.defineProperties(req.query).reduce(
    (filterAcc, [k, v]) => {
      filterAcc[k] = { $regex: v, $options: "i" };
      return filterAcc;
    },
    {}
  );
  const currentListingsParam = await collection.find(filter).toArray();
  res.json(currentListingsParam);
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
    // $set - 'update changes' to a listing (using payload/new info) by id
    { $set: req.body.payload }
  );
  res.json(updateList);
});

// Add a new listing
router.post("/listings", async (req, res) => {
  const addListing = await collection.insertOne(req.body);
  res.json(addListing);
  // console.log(
  //   `New listing created with the following id: ${addListing.insertedId}`
  // );
});

// Delete a single listing
router.delete("/listings/:id", async (req, res) => {
  const delList = await collection.deleteOne({ _id: req.body.id });
  res.json(delList);
  // console.log(`Listing id: ${delList.deletedId} was deleted`);
});

// Get single listing reviews
router.get("/reviews/:id", async (req, res) => {
  const oneListingReviews = await collection.findOne({ _id: req.body.id });
  res.json(oneListingReviews.reviews);
});

// Update listing review
router.put("/reviews/:id", async (req, res) => {
  const updateReview = await collection.updateOne(
    { "reviews._id": req.body.id },
    // $set - 'updates changes' to a review in a listing by review id
    { $set: { "reviews.$": req.body.payload } }
  );
  res.json(updateReview);
});

// Add review to listing
router.post("/reviews/:id", async (req, res) => {
  const addReview = await collection.updateOne(
    { _id: req.body.id },
    // $push - 'adds new' payload(review) to listing by id
    { $push: { reviews: req.body.payload } }
  );
  res.json(addReview);
});

// Delete a review
router.delete("/reviews/:id", async (req, res) => {
  // Use updateOne, else entire airbnb listing gets deleted.
  const delReview = await collection.updateOne(
    { "reviews._id": req.body.id },
    // $pull - 'removes review' from listing by review id
    { $pull: { reviews: { _id: req.body.id } } }
  );
  res.json(delReview);
});

export default router;
