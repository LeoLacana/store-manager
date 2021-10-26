const {
  setSales,
  showSales,
  showSalesId,
  updatingSales,
  deletedSales } = require('../services/serviceSales');

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
  if (sales === null) {
    return res.status(404).json({
      err: {
        code: 'not_found',
        message: 'Sale not found',
      },
    });
  }
  return res.status(200).json(sales);
};

const updateSales = async (req, res) => {
  const { id } = req.params;
  const itensSold = req.body;
  const sales = await updatingSales(id, itensSold);
  return res.status(200).json(sales); 
};

const deleteSales = async (req, res) => {
  const { id } = req.params;
  const sales = await deletedSales(id);
  return res.status(200).json(sales);
};

module.exports = {
  insertSales,
  getSales,
  getSalesId,
  updateSales,
  deleteSales,
};