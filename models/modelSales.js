const { ObjectId } = require('mongodb');
const connection = require('./connection');

async function insertSales(itensSold) {
  const db = await connection();
  const productSales = await db.collection('sales').insertOne({ itensSold });
  return {
    _id: productSales.insertedId,
    itensSold,
  };
}

async function getSales() {
  const db = await connection();
  const sales = await db.collection('sales').find().toArray();
  return sales;
}

async function getSalesId(id) {
  const db = await connection();
  const salesId = await db.collection('sales').findOne({ _id: ObjectId(id) });
  return salesId;
}

async function updateSales(id, itensSold) {
  const db = await connection();
  await db.collection('sales').updateOne(
    { _id: ObjectId(id) },
    {
      $set: {
        itensSold,
      },
    },
  );
  return getSalesId(id);
}

module.exports = {
  insertSales,
  getSales,
  getSalesId,
  updateSales,
};
