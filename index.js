const express = require('express');

const {
  insertProduct,
  getProducts,
  getProductId,
  updateProduct } = require('./controllers/controllerProducts');
const {
  validationLengthName,
  validationNameExist,
  validationQuantity,
  validationProduct } = require('./middlewares/middlewaresProducts');

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

app.listen(PORT, () => { 
  console.log(`Ouvindo a porta ${PORT}`); 
});
