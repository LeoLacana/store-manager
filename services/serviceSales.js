const { insertSales, getSales, getSalesId, updateSales } = require('../models/modelSales');

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

async function updatingSales(id, itensSold) {
  const sales = await updateSales(id, itensSold);
  return sales;
}

module.exports = {
  setSales,
  showSales,
  showSalesId,
  updatingSales,
};
