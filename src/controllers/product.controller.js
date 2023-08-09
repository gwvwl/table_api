const ProductModel = require('../models/product.model');
const { HOST_APP } = require('../utils/secrets');
exports.createProduct = async (req, res) => {
    const { name, amount, price, description } = req.body;

    //  img
    const file = req?.files?.img;
    const id_img_and_format = Date.now() + '.' + file?.name.split('.').pop();
    file?.mv(__dirname + '/../upload/' + id_img_and_format);
    const img_path = file ? 'http://localhost:8080/' + id_img_and_format : '';

    const product = await ProductModel.createProduct(name, amount, price, description, img_path);

    res.status(200).json({
        success: true,
        message: 'Product created',
        product,
        img_path,
    });
};

exports.getProducts = async (req, res) => {
    const { id } = req.query;

    let products;

    if (id) {
        const product = await ProductModel.getProductById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        products = [product];
    } else {
        products = await ProductModel.getAllProducts();
    }

    res.status(200).json({ success: true, message: 'Products retrieved', products });
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, amount, price, description, addition, category, stock } = req.body;

    //  img
    const file = req?.files?.img;
    const id_img_and_format = Date.now() + '.' + file?.name.split('.').pop();
    file?.mv(__dirname + '/../upload/' + id_img_and_format);
    const img_path = file ? 'http://localhost:8080/' + id_img_and_format : '';
    const product = await ProductModel.getProductById(id);

    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.name = name || product.name;
    product.amount = amount || product.amount;
    product.price = price || product.price;
    product.description = description || product.description;
    product.img_path = img_path || product.img_path;
    // stock
    if (stock) await ProductModel.addStockToProduct(id, stock);

    // addition
    if (addition) await ProductModel.addAdditionToProduct(id, addition);
    // category
    if (category) await ProductModel.addCategoryToProduct(id, category);

    await product.save();
    await product.reload();
    res.status(200).json({ success: true, message: 'Product updated', product });
};

exports.delRelProduct = async (req, res) => {
    const { id } = req.params;
    const { addition, category, stock } = req.body;

    const product = await ProductModel.getProductById(id);

    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // stock
    if (stock) await ProductModel.removeStockFromProduct(id, stock);

    // addition
    if (addition) await ProductModel.removeAdditionFromProduct(id, addition);
    // category
    if (category) await ProductModel.removeCategoryFromProduct(id, category);

    await product.save();
    await product.reload();
    res.status(200).json({ success: true, message: 'Product updated', product });
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    const product = await ProductModel.getProductById(id);

    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.destroy();

    res.status(200).json({ success: true, message: 'Product deleted' });
};
