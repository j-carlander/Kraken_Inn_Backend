import express from "express";

import { dbConnection } from "../database/database.js";
import { jwtFilter } from "../filter/jwtFilter.js";
import userControllers from "../controller/userControllers.js";
import profileControllers from "../controller/profileControllers.js";

export const router = express.Router();

/* Route to register a new user */
router.post("/auth/register", userControllers.register);

/* Route to log in a user */
router.post("/auth/login", userControllers.login);

/* Add JWT filter to all routes below this point */
router.use(jwtFilter);

router.get("/food", async (req, res) => {
  let result = await dbConnection.collection("kraken_inn").find().toArray();

  res.send(result);
});

router.get("/user/debitcard", profileControllers.getDebitCard);

router.get("/user/address", profileControllers.getAddress);

router.get("/user/balance", profileControllers.getBalance);

router.get("/user/profile", profileControllers.getProfile);

router.put("/user/debitcard", profileControllers.updateDebitCard);

router.put("/user/address", profileControllers.updateAddress);

router.patch("/user/balance", profileControllers.updateBalance);
