const StockModel = require('../models/stock.model');

exports.createStock = async (req, res) => {
    const { name, amount, price, quantity } = req.body;
    //  img
    const file = req?.files?.img;
    const id_img_and_format = Date.now() + '.' + file?.name.split('.').pop();
    file?.mv(__dirname + '/../upload/' + id_img_and_format);
    const img_path = file ? 'http://localhost:8080/' + id_img_and_format : '';
    try {
        const stock = await StockModel.createStock(name, amount, price, quantity, img_path);

        res.status(200).json({ success: true, message: 'Stock created', stock });
    } catch (error) {
        console.error('Error creating stock:', error);
        res.status(500).json({ success: false, message: 'Failed to create stock', error });
    }
};

exports.getStock = async (req, res) => {
    const { id } = req.query;

    let stocks;

    if (id) {
        const stock = await StockModel.getStockById(id);
        if (!stock) {
            return res.status(404).send({ success: false, message: 'Stock not found' });
        }
        stocks = [stock];
    } else {
        stocks = await StockModel.getAllStocks();
    }

    res.status(200).send({ success: true, data: stocks });
};

exports.updateStock = async (req, res) => {
    const { id } = req.params;
    const { name, amount, price, quantity } = req.body;
    //  img
    const file = req?.files?.img;
    const id_img_and_format = Date.now() + '.' + file?.name.split('.').pop();
    file?.mv(__dirname + '/../upload/' + id_img_and_format);
    const img_path = file ? 'http://localhost:8080/' + id_img_and_format : '';

    const stock = await StockModel.getStockById(id);

    stock.name = name || stock.name;
    stock.amount = amount || stock.amount;
    stock.price = price || stock.price;
    stock.quantity = quantity || stock.quantity;
    stock.img_path = img_path || stock.img_path;

    await stock.save();
    res.status(200).send({ success: true, message: 'Stock updated', stock });
};

exports.deleteStock = async (req, res) => {
    const { id } = req.params;

    const stock = await StockModel.getStockById(id);

    if (!stock) {
        return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    await stock.destroy();

    res.status(200).send({ success: true, message: 'Stock deleted' });
};
