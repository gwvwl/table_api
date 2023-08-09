const AdditionModel = require('../models/addition.model');

exports.createAddition = async (req, res) => {
    const { name, price } = req.body;
    //  img
    const file = req?.files?.img;

    const id_img_and_format = Date.now() + '.' + file?.name.split('.').pop();
    file?.mv(__dirname + '/../upload/' + id_img_and_format);
    const img_path = file ? 'http://localhost:8080/' + id_img_and_format : '';
    try {
        const addition = await AdditionModel.createAddition(name, price, img_path);

        res.status(200).json({ success: true, message: 'Addition created', addition });
    } catch (error) {
        console.error('Error creating addition:', error);
        res.status(500).json({ success: false, message: 'Failed to create addition' });
    }
};

exports.getAddition = async (req, res) => {
    const { id } = req.query;

    let additions;

    if (id) {
        const addition = await AdditionModel.getAdditionById(id);
        if (!addition) {
            return res.status(404).send({ success: false, message: 'Addition not found' });
        }
        additions = [addition];
    } else {
        additions = await AdditionModel.getAllAdditions();
    }

    res.status(200).send({ success: true, data: additions });
};

exports.updateAddition = async (req, res) => {
    const { id } = req.params;
    const { name, price, stock } = req.body;
    //  img
    const file = req?.files?.img;

    const id_img_and_format = Date.now() + '.' + file?.name.split('.').pop();
    file?.mv(__dirname + '/../upload/' + id_img_and_format);
    const img_path = file ? 'http://localhost:8080/' + id_img_and_format : '';
    const addition = await AdditionModel.getAdditionById(id);

    if (!addition) {
        return res.status(404).send({ success: false, message: 'Addition not found or name' });
    }

    addition.name = name || addition.name;
    addition.price = price || addition.price;
    addition.img_path = img_path || addition.img_path;
    // stock
    if (stock) await AdditionModel.addStockToAddition(id, stock);
    await addition.save();
    res.status(200).send({ success: true, message: 'Addition updated', addition });
};

exports.delStockFromAddition = async (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;

    const addition = await AdditionModel.getAdditionById(id);

    if (!addition) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // stock
    if (stock) await AdditionModel.removeStockFromAddition(id, stock);

    await addition.save();

    res.status(200).json({ success: true, message: 'Addition stock delete', addition });
};

exports.deleteAddition = async (req, res) => {
    const { id } = req.params;

    const addition = await AdditionModel.getAdditionById(id);

    if (!addition) {
        return res.status(404).json({ success: false, message: 'Addition not found' });
    }

    await addition.destroy();

    res.status(200).send({ success: true, message: 'Addition deleted' });
};
