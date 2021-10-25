const {
    insertProduct,
    getProducts,
    getProductId,
    updateProduct } = require('../models/modelProducts');

async function insertProducts(name, quantity) {
    const productInsert = await insertProduct(name, quantity);
    return productInsert;
}

async function getProduct() {
    const products = await getProducts();
    return products;
}

async function getProductsId(id) {
    const products = await getProductId(id);
    return products;
}

async function updateProducts(id, name, quantity) {
    const productUpdated = await updateProduct(id, name, quantity);
    return productUpdated;
}

module.exports = {
    insertProducts,
    getProduct,
    getProductsId,
    updateProducts,
};
