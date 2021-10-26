const { setSales, showSales, showSalesId } = require('../services/serviceSales');

const insertSales = async (req, res) => {
  const itensSold = req.body;
  const sales = await setSales(itensSold);
  return res.status(200).json(sales);
};

const getSales = async (req, res) => {
  const sales = await showSales();
  return res.status(200).json({ sales });
};

const getSalesId = async (req, res) => {
  const { id } = req.params;
  const sales = await showSalesId(id);
  return res.status(200).json(sales);
};

module.exports = {
  insertSales,
  getSales,
  getSalesId,
};