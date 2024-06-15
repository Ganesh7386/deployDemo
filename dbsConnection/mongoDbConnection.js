// mongoClient.js
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();

// const pass = encodeURIComponent("2002@ganSAIesh");
// const uri = `mongodb+srv://puttaganesh7386:2002%40ganSAIesh@cluster0.ctofzol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// above uri is exaple for mongo db cluster url which is stored in .env file with name as "MONGO_DB_URL";
const envVar  = process.env.MONGO_DB_URL;
console.log(envVar)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(envVar, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongo() {
    await client.connect();
    console.log("Connected to MongoDB!");
}

/*
the below function is for testing client obj returned by connectToMongo
async function createConnectionToMongoCluster() {
    const connPool = await connectToMongo()
    const transportDb = await connPool.db('transport');
    const usersColl = await transportDb.collection('users');
    const user = await usersColl.findOne({name : "bharath"});
    console.log(user);
}
*/

module.exports = {
  client,
  connectToMongo
};
