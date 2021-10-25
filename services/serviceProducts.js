const { insertProduct, getProducts, getProductId } = require('../models/modelProducts');

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

module.exports = {
    insertProducts,
    getProduct,
    getProductsId,
};
