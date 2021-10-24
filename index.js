const express = require('express');

const { insertProduct } = require('./controllers/controllerProducts');
const {
  validationLengthName,
  validationNameExist,
  validationQuantity } = require('./middlewares/middlewaresProducts');

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

app.listen(PORT, () => { 
  console.log(`Ouvindo a porta ${PORT}`); 
});
