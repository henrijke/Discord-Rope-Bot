const { mongoDbToken } = require('../config.json');
const { MongoClient } = require("mongodb");

// Replace the uri string with your MongoDB deployment's connection string.
const uri = mongoDbToken.token;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// async function run() {
//   try {
//     await client.connect();
//     // const initiative = {
//     //   userId: '1234',
//     //   name: 'Jaska',
//     //   initiative: 22
//     // };
//
//     const database = client.db('Rope');
//     const initiativeCollection = database.collection('Initiative');

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

    // const query = { user_id: "123456789" };
    // const update = { $set: { user_name: "köplöttäjä", initiative: 23 }};
    // const options = { upsert: true };
    // const result = await initiativeCollection.updateOne(query, update, options);
    // console.log(result.insertedCount);


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
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// const initiative = {
//   userId: '1234',
//   name: 'Jaska',
//   initiative: 22
// };

const connection = async () => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await client.connect();
  const database = client.db('Rope');
  const initiativeCollection = database.collection('Initiative');
  return initiativeCollection;
}

// Find One query
const findOne = async ( userId ) => {
  try {
    const initiativeCollection = await connection();
    const query = { 'user_id': userId };
    const projection = { initiative: 1, user_name: 1, _id: 0 };
    return await initiativeCollection.findOne(query).project(projection);
  } catch (error) {
    // Yaiks something went wrong
    console.log(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

const findAll = async () => {
  try {
    const initiativeCollection = await connection();
    // Sort descending query
    // define an empty query document
    const query = {};
    // sort in descending (-1) order by length, (1) ascending, ,user_name: 1 for secondary sort
    const sort = { initiative: -1 };
    const projection = { initiative: 1, user_name: 1, _id: 0 };
    const resultArray = [];
    const result = await initiativeCollection.find(query).project(projection).sort(sort).forEach(element => {
      resultArray.push(element);
    });
    return resultArray;
  } catch (error) {
    // Jaiks something went wrong
    console.log(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

const createOrUpdate = async ( initiative ) => {
  let result;
  try {
    const initiativeCollection = await connection();
    const query = { user_id: initiative.userId };
    const update = { $set: { user_name: initiative.name, initiative: initiative.initiative }};
    const options = { upsert: true };
    result = await initiativeCollection.updateOne(query, update, options);
  } catch (error) {
    // Jaiks something went wrong
    console.log(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    return result;
  }
}

const deleteOne = async ( userId ) => {
  try {
    const initiativeCollection = await connection();
    // Delete One query
    const result = await initiativeCollection.deleteOne({ user_id: userId });
    return result.deletedCount;
  } catch (error) {
    // Jaiks something went wrong
    console.log(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

const deleteAll = async () => {
  try {
    const initiativeCollection = await connection();
    // Delete One query
    const result = await initiativeCollection.deleteMany({});
    return result.deletedCount;
  } catch (error) {
    // Jaiks something went wrong
    console.log(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

module.exports = {
  findOne,
  createOrUpdate,
  deleteOne,
  deleteAll,
  findAll,
}
