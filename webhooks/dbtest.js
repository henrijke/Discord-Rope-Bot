// const mongoose = require('mongoose');
// const userSchema = require('./userSchema.js');
// const User = mongoose.model('user', userSchema, 'user');
const { mongoDbToken } = require('../config.json');
const { MongoClient } = require("mongodb");

// class Initiative {
//   userId;
//   name;
//   initiative;
//   constructor(userId, name, initiative) {
//     this.userId = userId;
//     this.name = name;
//     this.initiative = initiative
//   }
// }

// Replace the uri string with your MongoDB deployment's connection string.
const uri = mongoDbToken.token;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function run() {
  try {
    await client.connect();
    // const initiative = {
    //   userId: '1234',
    //   name: 'Jaska',
    //   initiative: 22
    // };

    const database = client.db('Rope');
    const initiativeCollection = database.collection('Initiative');

    // Delete One query
    // const result = await initiativeCollection.deleteOne({ user_id: '100' });
    // console.log(result.deletedCount);

    // Delete Many query
    // const result = await initiativeCollection.deleteMany({ user_name: 'toustaaja' });
    // console.log(result.deletedCount);

    // Update One query
    // const filter = { user_id: "0000" };
    // const updateDocument = {
    //    $set: {
    //       user_name: "päivitetty",
    //    },
    // };
    // const result = await initiativeCollection.updateOne(filter, updateDocument);
    // console.log(result.insertedCount);

    const query = { user_id: "123456789" };
    const update = { $set: { user_name: "köplöttäjä", initiative: 23 }};
    const options = { upsert: true };
    const result = await initiativeCollection.updateOne(query, update, options);
    console.log(result.insertedCount);
    // Specify which fields
    // const projection = { initiative: 1, user_name: 1, _id: 0 };
    // const cursor = initiativeCollection.find().project(projection);
    // await cursor.forEach(console.dir);

    // Sort descending query
    // define an empty query document
    // const query = {};
    // // sort in descending (-1) order by length, (1) ascending, ,user_name: 1 for secondary sort
    // const sort = { initiative: -1 };
    // const result = await initiativeCollection.find(query).sort(sort);
    // await result.forEach(console.dir);

    // Insert Many query
    // const newInitList = [
    //   { user_id: '100',
    //   user_name: 'teistaaja',
    //   initiative: 9 },
    //   { user_id: '101',
    //   user_name: 'toustaaja',
    //   initiative: 2 }
    // ];
    // const result = await initiativeCollection.insertMany(newInitList);
    // console.log(result.insertedCount);

    // Insert One query
    // const newInit = {
    //   user_id: '0000',
    //   user_name: 'testaaja',
    //   initiative: 1
    // }
    // const result = await initiativeCollection.insertOne(newInit);
    // console.log(result.insertedCount);

    // Find One query
    // const query = { 'user_name': 'asd' };
    // const init = await initiative.findOne(query);
    // console.log(init);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

//
// const connectionString = mongoDbToken.token;
//
// async function createUser(username) {
//   return new User({
//     username,
//     created: Date.now()
//   }).save()
// }
//
// async function findUser(username) {
//   return await User.findOne({ username })
// }
//
// ;(async () => {
//   const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
//   const username = process.argv[2].split('=')[1]
//
//   let user = await connector.then(async () => {
//     return findUser(username)
//   })
//
//   if (!user) {
//     user = await createUser(username)
//   }
//
//   console.log(user)
//   process.exit(0)
// })()
