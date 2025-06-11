const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://whodenur:sude2025@mybodyrules-cluster.1ng31e8.mongodb.net/mybodyrules?retryWrites=true&w=majority&ssl=false";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB bağlantısı başarılı!");
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();