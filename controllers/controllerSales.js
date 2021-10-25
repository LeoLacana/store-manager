const { setSales } = require('../services/serviceSales');

const insertSales = async (req, res) => {
  const itensSold = req.body;
  const sales = await setSales(itensSold);
  return res.status(200).json(sales);
};

module.exports = {
  insertSales,
};