import Router from "express";
import config from "./config.js";
import client from "./db/connections/client.js";

const collection = client.db(config.db.name).collection(config.db.collection);

const router = new Router();

// Test - Get hello world
router.get("/", (_, res) => {
  res.send("Hello World from API router!");
});
export default router;
