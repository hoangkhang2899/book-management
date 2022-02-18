const async = require("hbs/lib/async");
const { MongoClient, ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const URL = "mongodb+srv://sonhan14:trinhquocanh011@cluster0.dhmh6.mongodb.net/test";
const DATABASE_NAME = "FPTBook-ApplicationDev-Group2";

async function getdbo() {
  const client = await MongoClient.connect(URL);
  const dbo = client.db(DATABASE_NAME);
  return dbo;
}

async function insertObject(collectionName, objectToInsert) {
  const dbo = await getdbo();
  const newObject = await dbo.collection(collectionName).insertOne(objectToInsert);
  console.log("Gia tri id moi duoc insert la: ", newObject.insertedId.toHexString());
}

async function searchObjectbyName(collectionName, name) {
  const dbo = await getdbo();
  const result = await dbo.collection(collectionName).find({ name: name }).toArray();
  return result;
}

async function searchObjectbyPrice(collectionName, price) {
  const dbo = await getdbo();
  const result = await dbo.collection(collectionName).find({ price: price }).toArray();
  return result;
}

async function searchObjectbyCategory(collectionName, category) {
  const dbo = await getdbo();
  const result = await dbo
    .collection(collectionName)
    .find({ category: ObjectId(category) })
    .toArray();
  return result;
}

async function getAll(collectionName) {
  const dbo = await getdbo();
  const result = await dbo.collection(collectionName).find({}).sort({ time: -1 }).toArray();
  return result;
}

async function getAllFeedback() {
  const result = await getAll("Feedback");
  result.forEach((e) => (e.timeString = new Date(e.time).toLocaleString("vi-VN")));
  return result;
}

async function deleteDocumentById(collectionName, id) {
  const dbo = await getdbo();
  await dbo.collection(collectionName).deleteOne({ _id: ObjectId(id) });
}

async function getDocumentById(id, collectionName) {
  const dbo = await getdbo();
  const result = await dbo.collection(collectionName).findOne({ _id: ObjectId(id) });
  return result;
}

async function updateDocument(id, updateValues, collectionName) {
  const dbo = await getdbo();
  await dbo.collection(collectionName).updateOne({ _id: ObjectId(id) }, updateValues);
}

async function updateCart(userName, updateDict) {
  const dbo = await getdbo();
  await dbo.collection("Order").replaceOne({ user: userName }, updateDict, { upsert: true });
}

async function getCart(userName) {
  const dbo = await getdbo();
  const result = await dbo.collection("Order").findOne({ user: userName });
  return result;
}

async function findOne(collectionName, findObject) {
  const dbo = await getdbo();
  const result = await dbo.collection(collectionName).findOne(findObject);
  return result;
}

async function deleteOne(collectionName, deleteObject) {
  const dbo = await getdbo();
  const result = await dbo.collection(collectionName).deleteOne(deleteObject);
  if (result.deletedCount > 0) {
    return true;
  } else {
    return false;
  }
}

// async function find(collectionName, findObject) {
//     const dbo = await getdbo();
//     // .sort({_id : -1}) mean is sort newest to oldest
//     // .sort({_id : 1}) is the opposite
//     const result = await dbo.collection(collectionName).find(findObject).sort({ time: -1 }).toArray();
//     return result;
// }

async function checkUserRole(nameIn, passIn) {
  const dbo = await getdbo();
  const user = await dbo.collection("Users").findOne({ userName: nameIn, password: passIn });
  if (user == null) {
    return -1;
  } else {
    return user.role;
  }
}

async function checkUser(nameIn, passwordIn) {
  const dbo = await getDbo();
  const results = await dbo.collection("Users").findOne({ $and: [{ username: nameIn }, { password: passwordIn }] });
  if (results != null) return true;
  else return false;
}

async function saveDocument(collectionName, id, newValue) {
  const dbo = await getDbo();
  await dbo.collection(collectionName).save({ _id: ObjectId(id), newValue });
}

module.exports = {
  saveDocument,
  searchObjectbyPrice,
  searchObjectbyName,
  insertObject,
  getAll,
  deleteDocumentById,
  getDocumentById,
  updateDocument,
  findOne,
  deleteOne,
  checkUserRole,
  checkUser,
  searchObjectbyCategory,
  updateCart,
  getCart,
  getAllFeedback,
};
