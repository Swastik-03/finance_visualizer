import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Missing environment variable: "MONGODB_URI"');

const client = new MongoClient(uri);
const clientPromise = client.connect();

export async function connectToDatabase() {
  const client = await clientPromise;
  return { client, db: client.db("finance-tracker") };
}
