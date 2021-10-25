const {
    insertProduct,
    getProducts,
    getProductId,
    updateProduct,
    deleteProduct } = require('../models/modelProducts');

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

async function deleteProducts(id) {
    const productDeleted = await deleteProduct(id);
    return productDeleted;
}

module.exports = {
    insertProducts,
    getProduct,
    getProductsId,
    updateProducts,
    deleteProducts,
};
