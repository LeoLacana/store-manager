const {
  insertProducts,
  getProduct,
  getProductsId,
  updateProducts,
  deleteProducts } = require('../services/serviceProducts');

const insertProduct = async (req, res) => {
  const { name, quantity } = req.body;
  const products = await insertProducts(name, quantity);
  return res.status(201).json(products);
};

const getProducts = async (req, res) => {
  const products = await getProduct();
  return res.status(200).json({ products });
};

const getProductId = async (req, res) => {
  const { id } = req.params;
  const product = await getProductsId(id);
  return res.status(200).json(product);
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  await updateProducts(id, name, quantity);
  return res.status(200).json({ _id: id, name, quantity });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await getProductsId(id);
  await deleteProducts(id);
  return res.status(200).json(product);
};

module.exports = {
  insertProduct,
  getProducts,
  getProductId,
  updateProduct,
  deleteProduct,
};
