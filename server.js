import express from "express";
import cors from "cors";

import { router } from "./src/router/router.js";
import { connectToDb } from "./src/database/database.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use(router);

/**
 * If successfully connected to the mongo database
 * start the express server on port 4000
 */
connectToDb((err) => {
  if (!err) {
    app.listen(4000, () => {
      console.log("server is ready and listening on port 4000");
    });
  }
});
