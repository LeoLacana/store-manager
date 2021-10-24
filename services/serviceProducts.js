const { insertProduct } = require('../models/modelProducts');

async function insertProducts(name, quantity) {
    const productInsert = await insertProduct(name, quantity);
    return productInsert;
}

module.exports = {
    insertProducts,
};
