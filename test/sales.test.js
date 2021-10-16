const frisby = require('frisby');
const { MongoClient } = require('mongodb');

const mongoDbUrl = 'mongodb://localhost:27017/StoreManager';
const url = 'http://localhost:3000';
const invalidId = 99999;

describe('5 - Crie um endpoint para cadastrar vendas', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('StoreManager');
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
  });

  beforeEach(async () => {
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
    const products = [
      { name: 'Martelo de Thor', quantity: 10 },
      { name: 'Traje de encolhimento', quantity: 20 },
      { name: 'Escudo do Capitão América', quantity: 30 },
    ];
    await db.collection('products').insertMany(products);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que não é possível cadastrar compras com quantidade menor que zero', async () => {
    let result;
    let resultProductId;

    await frisby
      .get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        resultProductId = result.products[0]._id;
      });

    await frisby
      .post(`${url}/sales/`, [
        {
          productId: resultProductId,
          quantity: -1,
        },
      ])
      .expect('status', 422)
      .then((secondResponse) => {
        const { json } = secondResponse;
        expect(json.err.code).toBe('invalid_data');
        expect(json.err.message).toBe('Wrong product ID or invalid quantity');
      });
  });

  it('Será validado que não é possível cadastrar compras com quantidade igual a zero', async () => {
    let result;
    let resultProductId;

    await frisby
      .get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        resultProductId = result.products[0]._id;
      });

    await frisby
      .post(`${url}/sales/`, [
        {
          productId: resultProductId,
          quantity: 0,
        },
      ])
      .expect('status', 422)
      .then((secondResponse) => {
        const { json } = secondResponse;
        expect(json.err.code).toBe('invalid_data');
        expect(json.err.message).toBe('Wrong product ID or invalid quantity');
      });
  });

  it('Será validado que não é possível cadastrar compras com uma string no campo quantidade', async () => {
    let result;
    let resultProductId;

    await frisby
      .get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        resultProductId = result.products[0]._id;
      });

    await frisby
      .post(`${url}/sales/`, [
        {
          productId: resultProductId,
          quantity: 'String',
        },
      ])
      .expect('status', 422)
      .then((secondResponse) => {
        const { json } = secondResponse;
        expect(json.err.code).toBe('invalid_data');
        expect(json.err.message).toBe('Wrong product ID or invalid quantity');
      });
  });

  it('Será validado que é possível criar uma compra com sucesso', async () => {
    let result;
    let resultProductId;

    await frisby
      .get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        resultProductId = result.products[0]._id;
      });

    await frisby
      .post(`${url}/sales/`, [
        {
          productId: resultProductId,
          quantity: 2,
        },
      ])
      .expect('status', 200)
      .then((secondResponse) => {
        const { json } = secondResponse;
        const idFirstItenSold = json.itensSold[0].productId;
        const quantityFirstItenSold = json.itensSold[0].quantity;
        expect(json).toHaveProperty('_id');
        expect(idFirstItenSold).toBe(resultProductId);
        expect(quantityFirstItenSold).toBe(2);
      });
  });

  it('Será validado que é possível criar várias compras com sucesso', async () => {
    let result;
    let resultProductId;

    await frisby
      .get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        resultProductId = result.products[0]._id;
      });

    await frisby
      .post(`${url}/sales/`, [
        {
          productId: resultProductId,
          quantity: 2,
        },
        {
          productId: resultProductId,
          quantity: 6,
        },
      ])
      .expect('status', 200)
      .then((secondResponse) => {
        const { json } = secondResponse;
        const idFirstItenSold = json.itensSold[0].productId;
        const quantityFirstItenSold = json.itensSold[0].quantity;
        const idSecondItenSold = json.itensSold[1].productId;
        const quantitySecondItenSold = json.itensSold[1].quantity;
        expect(json).toHaveProperty('_id');
        expect(idFirstItenSold).toBe(resultProductId);
        expect(quantityFirstItenSold).toBe(2);
        expect(idSecondItenSold).toBe(resultProductId);
        expect(quantitySecondItenSold).toBe(6);
      });
  });
});

describe('6 - Crie um endpoint para listar as vendas', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('StoreManager');
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
  });

  beforeEach(async () => {
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
    const products = [
      { name: 'Martelo de Thor', quantity: 10 },
      { name: 'Traje de encolhimento', quantity: 20 },
      { name: 'Escudo do Capitão América', quantity: 30 },
    ];
    await db.collection('products').insertMany(products);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que todas as vendas estão sendo retornadas', async () => {
    let result;
    let resultProductId;
    let resultSales;
    let resultSalesId;

    await frisby
      .get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        resultProductId = result.products[0]._id;
      });

    await frisby
      .post(`${url}/sales/`, [
        {
          productId: resultProductId,
          quantity: 2,
        },
        {
          productId: resultProductId,
          quantity: 6,
        },
      ])
      .expect('status', 200)
      .then((responseSales) => {
        const { body } = responseSales;
        resultSales = JSON.parse(body);
        resultSalesId = resultSales._id;
      });

    await frisby
      .get(`${url}/sales/`)
      .expect('status', 200)
      .then((responseAll) => {
        const { body } = responseAll;
        const resultSalesAll = JSON.parse(body);
        const idSales = resultSalesAll.sales[0]._id;
        const idFirstProductSales = resultSalesAll.sales[0].itensSold[0].productId;
        const quantityFirstProductSales = resultSalesAll.sales[0].itensSold[0].quantity;
        const idSecondProductSales = resultSalesAll.sales[0].itensSold[1].productId;
        const quantitySecondProductSales = resultSalesAll.sales[0].itensSold[1].quantity;

        expect(idSales).toBe(resultSalesId);
        expect(idFirstProductSales).toBe(resultProductId);
        expect(quantityFirstProductSales).toBe(2);
        expect(idSecondProductSales).toBe(resultProductId);
        expect(quantitySecondProductSales).toBe(6);
      });
  });

  it('Será validado que é possível listar uma determinada venda', async () => {
    let result;
    let resultSales;
    let resultSalesId;

    await frisby
      .get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
      });

    await frisby
      .post(`${url}/sales/`, [
        {
          productId: result.products[0]._id,
          quantity: 2,
        },
        {
          productId: result.products[1]._id,
          quantity: 6,
        },
      ])
      .expect('status', 200)
      .then((responseSales) => {
        const { body } = responseSales;
        resultSales = JSON.parse(body);
        resultSalesId = resultSales._id;
      });

    await frisby
      .get(`${url}/sales/`)
      .expect('status', 200)
      .then((responseOne) => {
        const { body } = responseOne;
        const responseAll = JSON.parse(body);
        const idSales = responseAll.sales[0]._id;
        const idFirstProductSales = responseAll.sales[0].itensSold[0].productId;
        const quantityFirstProductSales = responseAll.sales[0].itensSold[0].quantity;
        const idSecondProductSales = responseAll.sales[0].itensSold[1].productId;
        const quantitySecondProductSales = responseAll.sales[0].itensSold[1].quantity;

        expect(idSales).toBe(resultSales._id);
        expect(idFirstProductSales).toBe(result.products[0]._id);
        expect(quantityFirstProductSales).toBe(2);
        expect(idSecondProductSales).toBe(result.products[1]._id);
        expect(quantitySecondProductSales).toBe(6);
      });
  });

  it('Será validado que não é possível listar uma venda inexistente', async () => {
    await frisby
      .get(`${url}/sales/9999`)
      .expect('status', 404)
      .then((responseOne) => {
        const { body } = responseOne;
        const responseError = JSON.parse(body);
        expect(responseError.err.code).toEqual('not_found');
        expect(responseError.err.message).toEqual('Sale not found');
      });
  });
});

describe('7 - Crie um endpoint para atualizar uma venda', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('StoreManager');
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
  });

  beforeEach(async () => {
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
    const products = [
      { name: 'Martelo de Thor', quantity: 10 },
      { name: 'Traje de encolhimento', quantity: 20 },
      { name: 'Escudo do Capitão América', quantity: 30 },
    ];
    await db.collection('products').insertMany(products);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que não é possível atualizar vendas com quantidade menor que zero', async () => {
    let result;
    let resultProductId;
    let resultSales;
    let resultSalesId;

    await frisby
      .get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        resultProductId = result.products[0]._id;
      });

    await frisby
      .post(`${url}/sales/`, [
        {
          productId: resultProductId,
          quantity: 2,
        },
      ])
      .expect('status', 200)
      .then((responseSales) => {
        const { body } = responseSales;
        resultSales = JSON.parse(body);
        resultSalesId = resultSales._id;
      });

    await frisby
      .put(`${url}/sales/${resultSales._id}`, [
        {
          productId: resultProductId,
          quantity: -1,
        },
      ])
      .expect('status', 422)
      .then((responseEdit) => {
        const { body } = responseEdit;
        const responseEditBody = JSON.parse(body);
        const error = responseEditBody.err.code;
        const { message } = responseEditBody.err;
        expect(error).toBe('invalid_data');
        expect(message).toBe('Wrong product ID or invalid quantity');
      });
  });

  it('Será validado que não é possível atualizar vendas com quantidade igual a zero', async () => {
    let result;
    let resultProductId;
    let resultSales;
    let resultSalesId;

    await frisby
      .get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        resultProductId = result.products[0]._id;
      });

    await frisby
      .post(`${url}/sales/`, [
        {
          productId: resultProductId,
          quantity: 2,
        },
      ])
      .expect('status', 200)
      .then((responseSales) => {
        const { body } = responseSales;
        resultSales = JSON.parse(body);
        resultSalesId = resultSales._id;
      });

    await frisby
      .put(`${url}/sales/${resultSalesId}`, [
        {
          productId: resultProductId,
          quantity: 0,
        },
      ])
      .expect('status', 422)
      .then((responseEdit) => {
        const { body } = responseEdit;
        const responseEditBody = JSON.parse(body);
        const error = responseEditBody.err.code;
        const { message } = responseEditBody.err;
        expect(error).toBe('invalid_data');
        expect(message).toBe('Wrong product ID or invalid quantity');
      });
  });

  it('Será validado que não é possível atualizar vendas com uma string no campo quantidade', async () => {
    let result;
    let resultProductId;
    let resultSales;
    let resultSalesId;

    await frisby
      .get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        resultProductId = result.products[0]._id;
      });

    await frisby
      .post(`${url}/sales/`, [
        {
          productId: resultProductId,
          quantity: 2,
        },
      ])
      .expect('status', 200)
      .then((responseSales) => {
        const { body } = responseSales;
        resultSales = JSON.parse(body);
        resultSalesId = resultSales._id;
      });

    await frisby
      .put(`${url}/sales/${resultSalesId}`, [
        {
          productId: resultProductId,
          quantity: 'String',
        },
      ])
      .expect('status', 422)
      .then((responseEdit) => {
        const { body } = responseEdit;
        const responseEditBody = JSON.parse(body);
        const error = responseEditBody.err.code;
        const { message } = responseEditBody.err;
        expect(error).toBe('invalid_data');
        expect(message).toBe('Wrong product ID or invalid quantity');
      });
  });

  it('Será validado que é possível atualizar uma venda com sucesso', async () => {
    let result;
    let resultProductId;
    let resultSales;
    let resultSalesId;

    await frisby
      .get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        resultProductId = result.products[0]._id;
      });

    await frisby
      .post(`${url}/sales/`, [
        {
          productId: resultProductId,
          quantity: 2,
        },
      ])
      .expect('status', 200)
      .then((responseSales) => {
        const { body } = responseSales;
        resultSales = JSON.parse(body);
        resultSalesId = resultSales._id;
      });

    await frisby
      .put(`${url}/sales/${resultSalesId}`, [
        {
          productId: resultProductId,
          quantity: 5,
        },
      ])
      .expect('status', 200)
      .then((responseEdit) => {
        const { body } = responseEdit;
        const responseEditBody = JSON.parse(body);
        const salesId = responseEditBody._id;
        const idProductSales = responseEditBody.itensSold[0].productId;
        const quantityProductSales = responseEditBody.itensSold[0].quantity;
        expect(salesId).toBe(resultSalesId);
        expect(idProductSales).toBe(resultSales.itensSold[0].productId);
        expect(quantityProductSales).toBe(5);
      });
  });
});

describe('8 - Crie um endpoint para deletar uma venda', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('StoreManager');
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
  });

  beforeEach(async () => {
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
    const products = [
      { name: 'Martelo de Thor', quantity: 10 },
      { name: 'Traje de encolhimento', quantity: 20 },
      { name: 'Escudo do Capitão América', quantity: 30 },
    ];
    await db.collection('products').insertMany(products);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que é possível deletar uma venda com sucesso', async () => {
    let result;
    let resultSales;
    let resultProductId;
    let resultSalesId;

    await frisby
      .get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        resultProductId = result.products[0]._id;
      });

    await frisby
      .post(`${url}/sales/`, [
        {
          productId: resultProductId,
          quantity: 2,
        },
      ])
      .expect('status', 200)
      .then((responseSales) => {
        const { body } = responseSales;
        resultSales = JSON.parse(body);
        resultSalesId = resultSales._id;
      });

    await frisby.delete(`${url}/sales/${resultSalesId}`).expect('status', 200);

    await frisby
      .get(`${url}/sales/${resultSalesId}`)
      .expect('status', 404)
      .expect((resultGet) => {
        const { body } = resultGet;
        const resultGetBody = JSON.parse(body);
        const error = resultGetBody.err.code;
        const { message } = resultGetBody.err;
        expect(error).toBe('not_found');
        expect(message).toBe('Sale not found');
      });
  });

  it('Será validado que não é possível deletar uma venda que não existe', async () => {
    await frisby
      .delete(`${url}/sales/${invalidId}`)
      .expect('status', 422)
      .expect((resultDelete) => {
        const { body } = resultDelete;
        const resultDeleteBody = JSON.parse(body);
        const error = resultDeleteBody.err.code;
        const { message } = resultDeleteBody.err;
        expect(error).toBe('invalid_data');
        expect(message).toBe('Wrong sale ID format');
      });
  });
});

describe('9 - Atualize a quantidade de produtos', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('StoreManager');
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
  });

  beforeEach(async () => {
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
    const products = [
      { name: 'Martelo de Thor', quantity: 10 },
      { name: 'Traje de encolhimento', quantity: 20 },
      { name: 'Escudo do Capitão América', quantity: 30 },
    ];
    await db.collection('products').insertMany(products);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que é possível a quantidade do produto atualize ao fazer uma compra', async () => {
    let result;
    let responseProductId;

    await frisby
      .get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        responseProductId = result.products[0]._id;
      });

    await frisby
      .post(`${url}/sales/`, [
        {
          productId: responseProductId,
          quantity: 2,
        },
      ])
      .expect('status', 200);

    await frisby
      .get(`${url}/products/${responseProductId}`)
      .expect('status', 200)
      .expect((responseProducts) => {
        const { body } = responseProducts;
        const resultProducts = JSON.parse(body);
        const quantityProducts = resultProducts.quantity;
        expect(quantityProducts).toBe(8);
      });
  });

  it('Será validado que é possível a quantidade do produto atualize ao deletar uma compra', async () => {
    let result;
    let resultSales;
    let responseProductId;
    let responseSalesId;

    await frisby
      .get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        responseProductId = result.products[0]._id;
      });

    await frisby
      .post(`${url}/sales/`, [
        {
          productId: responseProductId,
          quantity: 2,
        },
      ])
      .expect('status', 200)
      .then((responseSales) => {
        const { body } = responseSales;
        resultSales = JSON.parse(body);
        responseSalesId = resultSales._id;
      });

    await frisby.delete(`${url}/sales/${responseSalesId}`).expect('status', 200);

    await frisby
      .get(`${url}/products/${responseProductId}`)
      .expect('status', 200)
      .expect((responseProducts) => {
        const { body } = responseProducts;
        const resultProducts = JSON.parse(body);
        const quantityProducts = resultProducts.quantity;
        expect(quantityProducts).toBe(10);
      });
  });
});

describe('10 - Valide a quantidade de produtos', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('StoreManager');
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
  });

  beforeEach(async () => {
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
    const products = [
      { name: 'Martelo de Thor', quantity: 10 },
      { name: 'Traje de encolhimento', quantity: 20 },
      { name: 'Escudo do Capitão América', quantity: 30 },
    ];
    await db.collection('products').insertMany(products);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
    await db.collection('sales').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que o estoque do produto nunca fique com a quantidade menor que zero', async () => {
    let result;
    let responseProductId;

    await frisby
      .get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        responseProductId = result.products[0]._id;
      });

    await frisby
      .post(`${url}/sales/`, [
        {
          productId: responseProductId,
          quantity: 100,
        },
      ])
      .expect('status', 404)
      .then((responseSales) => {
        const { json } = responseSales;
        expect(json.err.code).toBe('stock_problem');
        expect(json.err.message).toBe('Such amount is not permitted to sell');
      });
  });
});
