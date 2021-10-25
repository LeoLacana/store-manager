const { insertSales } = require('../models/modelSales');

async function setSales(itensSold) {
  const sale = await insertSales(itensSold);
  return sale;
}

module.exports = {
  setSales,
};
