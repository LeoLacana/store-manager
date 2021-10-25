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

module.exports = {
  validationQuantitySales,
};
