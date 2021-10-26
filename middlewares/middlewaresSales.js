const { ObjectId } = require('mongodb');

async function validationQuantitySales(req, res, next) {
  const itensSold = req.body;
  const isValid = itensSold
    .some((item) => item.quantity <= 0 || typeof (item.quantity) !== 'number');
  console.log(isValid);
  if (isValid) {
    return res.status(422).json({ err: {
        code: 'invalid_data',
        message: 'Wrong product ID or invalid quantity',
      },
    });
  }
  next();
}

const validationSales = async (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      err: {
        code: 'not_found',
        message: 'Sale not found',
      },
    });
  }
  next();
};

const validationDeleteSales = async (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(422).json({
      err: {
        code: 'invalid_data',
        message: 'Wrong sale ID format',
      },
    });
  }
  next();
};

module.exports = {
  validationQuantitySales,
  validationSales,
  validationDeleteSales,
};
