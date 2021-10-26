const { insertSales, getSales, getSalesId } = require('../models/modelSales');

async function setSales(itensSold) {
  const sale = await insertSales(itensSold);
  return sale;
}

async function showSales() {
  const sales = await getSales();
  return sales;
}

async function showSalesId(id) {
  const sales = await getSalesId(id);
  return sales;
}

module.exports = {
  setSales,
  showSales,
  showSalesId,
};
