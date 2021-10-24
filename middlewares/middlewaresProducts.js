const { getProducts } = require('../models/modelProducts');

const validationLengthName = (req, res, next) => {
  const { name } = req.body;
  if (name.length < 5) {
    console.log(1);
    return res.status(422).json({
      err: {
        code: 'invalid_data',
        message: '"name" length must be at least 5 characters long',
      },
    });
  }
  next();
};

const validationNameExist = async (req, res, next) => {
  const { name } = req.body;
  const allProducts = await getProducts();
  const statuValidation = allProducts.some((product) => product.name === name);
  if (statuValidation) {
    console.log(2);
    return res.status(422).json({
      err: {
        code: 'invalid_data',
        message: 'Product already exists',
      },
    });
  }
  next();
};

const validationQuantity = (req, res, next) => {
  const { quantity } = req.body;
  if (quantity <= 0) {
    console.log(3);
    return res.status(422).json({ err: {
        code: 'invalid_data',
        message: '"quantity" must be larger than or equal to 1',
      },
    });
  }
  if (typeof (quantity) !== 'number') { 
    console.log(4);
    return res.status(422).json({ err: {
        code: 'invalid_data',
        message: '"quantity" must be a number',
      },
    });
  }
  next();
};

module.exports = {
  validationLengthName,
  validationNameExist,
  validationQuantity,
};