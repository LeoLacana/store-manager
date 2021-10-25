const { ObjectId } = require('mongodb');
const connection = require('./connection');
// const { ObjectId } = require('mongodb');

async function insertProduct(name, quantity) {
    const db = await connection();
    const setProducts = await db.collection('products').insertOne({ name, quantity });
    return { _id: setProducts.insertedId, name, quantity };
}

async function getProducts() {
    const db = await connection();
    const allProducts = await db.collection('products').find().toArray();
    return allProducts;
}

async function getProductId(id) {
    const db = await connection();
    const product = await db.collection('products').findOne({ _id: ObjectId(id) });
    console.log(2);
    if (!product) return null;
    return product;
}

module.exports = {
    insertProduct,
    getProducts,
    getProductId,
};
