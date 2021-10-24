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

module.exports = {
    insertProduct,
    getProducts,
};
