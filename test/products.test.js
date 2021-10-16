const frisby = require('frisby');
const { MongoClient } = require('mongodb');

const mongoDbUrl = 'mongodb://localhost:27017/StoreManager';
const url = 'http://localhost:3000';
const invalidId = 99999;

describe('1 - Crie um endpoint para o cadastro de produtos', () => {
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
    const myobj = { name: 'Martelo de Thor', quantity: 10 };
    await db.collection('products').insertOne(myobj);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que não é possível criar um produto com o nome menor que 5 caracteres', async () => {
    await frisby
      .post(`${url}/products/`, {
        name: 'Rai',
        quantity: 100,
      })
      .expect('status', 422)
      .then((res) => {
        let { body } = res;
        body = JSON.parse(body);
        const error = body.err.code;
        const { message } = body.err;
        expect(error).toEqual('invalid_data');
        expect(message).toEqual('"name" length must be at least 5 characters long');
      });
  });

  it('Será validado que não é possível criar um produto com o mesmo nomede outro já existente', async () => {
    await frisby
      .post(`${url}/products/`, {
        name: 'Martelo de Thor',
        quantity: 100,
      })
      .expect('status', 422)
      .then((res) => {
        let { body } = res;
        body = JSON.parse(body);
        const error = body.err.code;
        const { message } = body.err;
        expect(error).toEqual('invalid_data');
        expect(message).toEqual('Product already exists');
      });
  });

  it('Será validado que não é possível criar um produto com quantidade menor que zero', async () => {
    await frisby
      .post(`${url}/products`, {
        name: 'Produto do Batista',
        quantity: -1,
      })
      .expect('status', 422)
      .then((res) => {
        let { body } = res;
        body = JSON.parse(body);
        const error = body.err.code;
        const { message } = body.err;
        expect(error).toEqual('invalid_data');
        expect(message).toEqual('"quantity" must be larger than or equal to 1');
      });
  });

  it('Será validado que não é possível criar um produto com quantidade igual a zero', async () => {
    await frisby
      .post(`${url}/products`, {
        name: 'Produto do Batista',
        quantity: 0,
      })
      .expect('status', 422)
      .then((res) => {
        let { body } = res;
        body = JSON.parse(body);
        const error = body.err.code;
        const { message } = body.err;
        expect(error).toEqual('invalid_data');
        expect(message).toEqual('"quantity" must be larger than or equal to 1');
      });
  });

  it('Será validado que não é possível criar um produto com uma string no campo quantidade', async () => {
    await frisby
      .post(`${url}/products`, {
        name: 'Produto do Batista',
        quantity: 'string',
      })
      .expect('status', 422)
      .then((res) => {
        let { body } = res;
        body = JSON.parse(body);
        const error = body.err.code;
        const { message } = body.err;
        expect(error).toEqual('invalid_data');
        expect(message).toEqual('"quantity" must be a number');
      });
  });

  it('Será validado que é possível criar um produto com sucesso', async () => {
    await frisby
      .post(`${url}/products`, {
        name: 'Arco do Gavião Arqueiro',
        quantity: 1,
      })
      .expect('status', 201)
      .then((res) => {
        let { body } = res;
        body = JSON.parse(body);
        const productName = body.name;
        const quantityProduct = body.quantity;
        expect(productName).toEqual('Arco do Gavião Arqueiro');
        expect(quantityProduct).toEqual(1);
        expect(body).toHaveProperty('_id');
      });
  });
});

describe('2 - Crie um endpoint para listar os produtos', () => {
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
    const products = [{ name: 'Martelo de Thor', quantity: 10 },
      { name: 'Traje de encolhimento', quantity: 20 },
      { name: 'Escudo do Capitão América', quantity: 30 }];
    await db.collection('products').insertMany(products);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que todos produtos estão sendo retornados', async () => {
    await frisby
      .get(`${url}/products`)
      .expect('status', 200)
      .then((res) => {
        let { body } = res;
        body = JSON.parse(body);
        const firstProductName = body.products[0].name;
        const firstQuantityProduct = body.products[0].quantity;
        const secondProductName = body.products[1].name;
        const secondQuantityProduct = body.products[1].quantity;
        const thirdProductName = body.products[2].name;
        const thirdQuantityProduct = body.products[2].quantity;

        expect(firstProductName).toEqual('Martelo de Thor');
        expect(firstQuantityProduct).toEqual(10);
        expect(secondProductName).toEqual('Traje de encolhimento');
        expect(secondQuantityProduct).toEqual(20);
        expect(thirdProductName).toEqual('Escudo do Capitão América');
        expect(thirdQuantityProduct).toEqual(30);
      });
  });

  it('Será validado que não é possível listar um produto que não existe', async () => {
    await frisby.get(`${url}/products/${invalidId}`)
      .expect('status', 422)
      .then((secondResponse) => {
        const { json } = secondResponse;
        const error = json.err.code;
        const { message } = json.err;
        expect(error).toEqual('invalid_data');
        expect(message).toEqual('Wrong id format');
      });
  });

  it('Será validado que é possível listar um determinado produto', async () => {
    let result;

    await frisby
      .post(`${url}/products`, {
        name: 'Armadura do Homem de Ferro',
        quantity: 40,
      })
      .expect('status', 201)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        responseProductId = result._id;
      });

    await frisby.get(`${url}/products/${responseProductId}`)
      .expect('status', 200)
      .then((secondResponse) => {
        const { json } = secondResponse;
        const productName = json.name;
        const quantityProduct = json.quantity;
        expect(productName).toEqual('Armadura do Homem de Ferro');
        expect(quantityProduct).toEqual(40);
      });
  });
});

describe('3 - Crie um endpoint para atualizar um produto', () => {
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
    const myobj = { name: 'Martelo de Thor', quantity: 10 };
    await db.collection('products').insertOne(myobj);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que não é possível atualizar um produto com o nome menor que 5 caracteres', async () => {
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

    await frisby.put(`${url}/products/${resultProductId}`,
      {
        name: 'Mar',
        quantity: 10,
      })
      .expect('status', 422)
      .then((secondResponse) => {
        const { json } = secondResponse;
        expect(json.err.code).toEqual('invalid_data');
        expect(json.err.message).toEqual('"name" length must be at least 5 characters long');
      });
  });

  it('Será validado que não é possível atualizar um produto com quantidade menor que zero', async () => {
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

    await frisby.put(`${url}/products/${resultProductId}`,
      {
        name: 'Martelo de Thor',
        quantity: -1,
      })
      .expect('status', 422)
      .then((secondResponse) => {
        const { json } = secondResponse;
        expect(json.err.code).toEqual('invalid_data');
        expect(json.err.message).toEqual('"quantity" must be larger than or equal to 1');
      });
  });

  it('Será validado que não é possível atualizar um produto com quantidade igual a zero', async () => {
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

    await frisby.put(`${url}/products/${resultProductId}`,
      {
        name: 'Martelo de Thor',
        quantity: 0,
      })
      .expect('status', 422)
      .then((secondResponse) => {
        const { json } = secondResponse;
        expect(json.err.code).toEqual('invalid_data');
        expect(json.err.message).toEqual('"quantity" must be larger than or equal to 1');
      });
  });

  it('Será validado que não é possível atualizar um produto com uma string no campo quantidade', async () => {
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

    await frisby.put(`${url}/products/${resultProductId}`,
      {
        name: 'Martelo de Thor',
        quantity: 'string',
      })
      .expect('status', 422)
      .then((secondResponse) => {
        const { json } = secondResponse;
        expect(json.err.code).toEqual('invalid_data');
        expect(json.err.message).toEqual('"quantity" must be a number');
      });
  });

  it('Será validado que é possível atualizar um produto com sucesso', async () => {
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

    await frisby.put(`${url}/products/${resultProductId}`,
      {
        name: 'Machado de Thor',
        quantity: 20,
      })
      .expect('status', 200)
      .then((secondResponse) => {
        const { json } = secondResponse;
        const productName = json.name;
        const quantityProduct = json.quantity;
        expect(productName).toEqual('Machado de Thor');
        expect(quantityProduct).toEqual(20);
      });
  });
});

describe('4 - Crie um endpoint para deletar um produto', () => {
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
    const myobj = { name: 'Martelo de Thor', quantity: 10 };
    await db.collection('products').insertOne(myobj);
  });

  afterEach(async () => {
    await db.collection('products').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  it('Será validado que não é possível deletar um produto com sucesso', async () => {
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

    await frisby.delete(`${url}/products/${resultProductId}`)
      .expect('status', 200);

    await frisby.get(`${url}/products/`)
      .expect('status', 200)
      .then((response) => {
        const { body } = response;
        result = JSON.parse(body);
        expect(result.products.length).toBe(0);
      });
  });

  it('Será validado que não é possível deletar um produto que não existe', async () => {
    await frisby
      .delete(`${url}/products/${invalidId}`)
      .expect('status', 422)
      .then((secondResponse) => {
        const { json } = secondResponse;
        expect(json.err.code).toEqual('invalid_data');
        expect(json.err.message).toEqual('Wrong id format');
      });
  });
});
