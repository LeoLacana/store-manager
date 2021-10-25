const { ObjectId } = require('mongodb');
const connection = require('./connection');

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

async function updateProduct(id, name, quantity) {
    const db = await connection();
    await db.collection('products').updateOne(
        { _id: ObjectId(id) },
        { $set: {
            name,
            quantity,
        } },
    );
}

module.exports = {
    insertProduct,
    getProducts,
    getProductId,
    updateProduct,
};
