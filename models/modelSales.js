const connection = require('./connection');

async function insertSales(itensSold) {
    const db = await connection();
    const productSales = await db.collection('sales').insertOne({ itensSold });
    return {
        _id: productSales.insertedId,
        itensSold,
    };
}

module.exports = {
    insertSales,
};
