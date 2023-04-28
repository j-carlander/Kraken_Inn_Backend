import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dbConnection } from "../database/database.js";

/**
 * checks so that username and password is filled in and correctly inserted without blank space
 * checks so that the username exist
 * compares the password with the stored one using bcrypt
 * creates a jwt token and sends it with the response
 */

async function login(req, res) {
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
}

/**
 * checks so that username and password is filled in and correctly inserted without blank space
 * checks so that the username isn't taken
 * hashes the password with bcrypt
 * Inserts the user into the database
 */
async function register(req, res) {
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
}

export default { login, register };
