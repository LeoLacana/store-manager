const express = require('express');

const {
  insertProduct,
  getProducts,
  getProductId,
  updateProduct,
  deleteProduct } = require('./controllers/controllerProducts');

const {
  insertSales,
  getSales,
  getSalesId,
  updateSales } = require('./controllers/controllerSales');

const {
  validationLengthName,
  validationNameExist,
  validationQuantity,
  validationProduct } = require('./middlewares/middlewaresProducts');

const {
  validationQuantitySales,
  validationSales } = require('./middlewares/middlewaresSales');

const app = express();
app.use(express.json());

const PORT = 3000;

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.post('/products',
  validationLengthName,
  validationNameExist,
  validationQuantity,
  insertProduct);

app.get('/products',
  getProducts);

app.get('/products/:id',
  validationProduct,
  getProductId);

app.put('/products/:id',
  validationLengthName,
  validationQuantity,
  updateProduct);

app.delete('/products/:id',
  validationProduct,
  deleteProduct);

app.post('/sales',
  validationQuantitySales,
  insertSales);

app.get('/sales',
  getSales);

app.get('/sales/:id',
  validationSales,
  getSalesId);

app.put('/sales/:id',
  validationQuantitySales,
  updateSales);

app.listen(PORT, () => { 
  console.log(`Ouvindo a porta ${PORT}`); 
});
