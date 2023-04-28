import express from "express";

import { dbConnection } from "../database/database.js";
import { jwtFilter } from "../filter/jwtFilter.js";
import userServices from "../services/userServices.js";
import profileServices from "../services/profileServices.js";

export const router = express.Router();

/* Route to register a new user */
router.post("/auth/register", userServices.register);

/* Route to log in a user */
router.post("/auth/login", userServices.login);

/* Add JWT filter to all routes below this point */
router.use(jwtFilter);

router.get("/food", async (req, res) => {
  let result = await dbConnection.collection("kraken_inn").find().toArray();

  res.send(result);
});

router.get("/user/debitcard", profileServices.getDebitCard);

router.get("/user/address", profileServices.getAddress);

router.get("/user/balance", profileServices.getBalance);

router.get("/user/balance", profileServices.getProfile);

router.put("/user/debitcard", profileServices.updateDebitCard);

router.put("/user/address", profileServices.updateAddress);

router.patch("/user/balance", profileServices.updateBalance);
