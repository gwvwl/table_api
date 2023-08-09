const CategoryModel = require('../models/category.model');

exports.createCategory = async (req, res) => {
    const { name } = req.body;
    //  img
    const file = req?.files?.img;
    const id_img_and_format = Date.now() + '.' + file?.name.split('.').pop();
    file?.mv(__dirname + '/../upload/' + id_img_and_format);
    const img_path = file ? 'http://localhost:8080/' + id_img_and_format : '';
    const category = await CategoryModel.createCategory(name, img_path);

    res.status(200).json({ success: true, message: 'Category created', category });
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.getAllCategories();

        res.status(200).json({
            success: true,
            message: 'Categories retrieved',
            data: categories,
        });
    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve categories' });
    }
};

exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    //  img
    const file = req?.files?.img;
    const id_img_and_format = Date.now() + '.' + file?.name.split('.').pop();
    file?.mv(__dirname + '/../upload/' + id_img_and_format);
    const img_path = file ? 'http://localhost:8080/' + id_img_and_format : '';

    const category = await CategoryModel.updateCategory(id, name, img_path);

    if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, message: 'Category updated', category });
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    const category = await CategoryModel.deleteCategory(id);

    if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, message: 'Category deleted' });
};
