const { insertProducts } = require('../services/serviceProducts');

const insertProduct = async (req, res) => {
    console.log(5);
    const { name, quantity } = req.body;
    const data = await insertProducts(name, quantity);
    return res.status(201).json(data);
};

module.exports = {
    insertProduct,
};
