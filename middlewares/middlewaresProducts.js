const { ObjectId } = require('mongodb');
const { getProducts } = require('../models/modelProducts');

const validationLengthName = (req, res, next) => {
  const { name } = req.body;
  if (name.length < 5) {
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
    return res.status(422).json({ err: {
        code: 'invalid_data',
        message: '"quantity" must be larger than or equal to 1',
      },
    });
  }
  if (typeof (quantity) !== 'number') {
    return res.status(422).json({ err: {
        code: 'invalid_data',
        message: '"quantity" must be a number',
      },
    });
  }
  next();
};

const validationProduct = async (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(422).json({ 
      err: {
        code: 'invalid_data',
        message: 'Wrong id format',
      },
    });
  }
  next();
};

module.exports = {
  validationLengthName,
  validationNameExist,
  validationQuantity,
  validationProduct,
};