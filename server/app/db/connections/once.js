// Loads a reusable Mongo client for the application. (Keeps client conn open).
import { MongoClient } from "mongodb"; // 'M...' means use with 'new'.
import config from "../../config.js";

const client = new MongoClient(config.db.clientURL);

export default {
  connect() {
    // Returns a promise
    return client.connect();
  },
  close() {
    client.close().then(() => {
      console.info("MongoDB Client disconnected");
      process.exit(0);
    });
  },
};
