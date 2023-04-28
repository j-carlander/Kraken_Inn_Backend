import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dbConnection } from "../database/database.js";
import { jwtFilter } from "../filter/jwtFilter.js";

export const router = express.Router();

/** Route to register a new user
 * checks so that username and password is filled in and correctly inserted without blank space
 * checks so that the username isn't taken
 * hashes the password with bcrypt
 * Inserts the user into the database
 */
router.post("/auth/register", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password)
    return res.status(400).send({ msg: "Missing user details" });

  if (username.includes(" ") || password.includes(" "))
    return res.status(400).send({ msg: "Missing user details" });

  password = await bcrypt.hash(password, 10);

  let result = await dbConnection.collection("users").updateOne(
    { username },
    {
      $setOnInsert: {
        username,
        password,
      },
    },
    { upsert: true }
  );

  if (result.upsertedCount != 1)
    return res.status(409).send({ msg: "User already exist" });

  res.status(201).send(result);
});

/** Route to log in a user
 * checks so that username and password is filled in and correctly inserted without blank space
 * checks so that the username exist
 * compares the password with the stored one using bcrypt
 * creates a jwt token and sends it with the response
 */
router.post("/auth/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password)
    return res.status(400).send({ msg: "Missing user details" });

  if (username.includes(" ") || password.includes(" "))
    return res
      .status(422)
      .send({ msg: "User details may not include blank space" });

  let checkUserExists = await dbConnection
    .collection("users")
    .findOne({ username });

  if (!checkUserExists)
    return res.status(400).send({ msg: "User don't exist" });

  let comparePass = await bcrypt.compare(password, checkUserExists.password);

  if (!comparePass) return res.status(400).send({ msg: "Incorrect password" });

  let token = jwt.sign(username, "superSecret");

  res.send({ jwt: token, username: username });
});

router.use(jwtFilter);

router.get("/food", async (req, res) => {
  let result = await dbConnection.collection("kraken_inn").find().toArray();

  res.send(result);
});
