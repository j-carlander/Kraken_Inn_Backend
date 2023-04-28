import { dbConnection } from "../database/database.js";

async function updateDebitCard(req, res) {
  let currentUser = req.userDetails.username;

  data = { debit_card: req.body };
  let result = await dbConnection
    .collection("profiles")
    .updateOne({ username: currentUser }, { $set: data }, { upsert: true });
  res.sendStatus(200);
}

async function updateAddress(req, res) {
  let currentUser = req.userDetails.username;

  data = { address: req.body };
  let result = await dbConnection
    .collection("profiles")
    .updateOne({ username: currentUser }, { $set: data }, { upsert: true });
  res.sendStatus(200);
}

async function updateBalance(req, res) {
  let currentUser = req.userDetails.username;

  data = { balance: req.body };
  let result = await dbConnection
    .collection("profiles")
    .updateOne({ username: currentUser }, { $inc: data });

  res.sendStatus(200);
}

async function getDebitCard(req, res) {
  let currentUser = req.userDetails.username;

  let result = await dbConnection
    .collection("profiles")
    .findOne({ username: currentUser }, { debit_card: 1 });
  res.send(result);
}

async function getAddress(req, res) {
  let currentUser = req.userDetails.username;

  let result = await dbConnection
    .collection("profiles")
    .findOne({ username: currentUser }, { address: 1 });
  res.send(result);
}

async function getBalance(req, res) {
  let currentUser = req.userDetails.username;

  let result = await dbConnection
    .collection("profiles")
    .findOne({ username: currentUser }, { balance: 1 });
  res.send(result);
}

async function getProfile(req, res) {
  let currentUser = req.userDetails.username;

  let result = await dbConnection
    .collection("profiles")
    .findOne({ username: currentUser });
  res.send(result);
}

export default {
  updateAddress,
  updateBalance,
  updateDebitCard,
  getAddress,
  getBalance,
  getDebitCard,
  getProfile,
};
