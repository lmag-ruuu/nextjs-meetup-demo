import { MongoClient } from "mongodb";

const url =
  "mongodb+srv://ruben:Gf0UD4JuZwp5Wtgb@cluster0.ejlc8.mongodb.net/meetups?retryWrites=true&w=majority";

const client = new MongoClient(url);

async function handler(request, response) {
  if (request.method === "POST") {
    const data = request.body;
    try {
      await client.connect();
      const database = client.db();
      const meetupsCollection = database.collection("meetups");

      const result = await meetupsCollection.insertOne(data);
    } catch (err) {
      console.log(err.stack);
    } finally {
      await client.close();
      response.status(201).json({ message: "Meetup Inserted!" });
    }
  }
}

export default handler;
