import { MongoClient } from "mongodb";

export let dbConnection;

/** handles the connection to the mongo database */
export async function connectToDb(callback) {
  try {
    let client = await MongoClient.connect("mongodb://127.0.0.1:27017");
    dbConnection = client.db("kraken_inn");
    return callback();
  } catch (err) {
    console.log(err);
    return callback(err);
  }
}
