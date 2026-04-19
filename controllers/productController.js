const Product = require('../models/Product');
const isValidShortId = require('../utils/isValidShortId');

// GET /api/products?category=&search=
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search && String(search).trim()) {
      const q = String(search).trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:shortId
const getProductById = async (req, res) => {
  try {
    const { shortId } = req.params;
    if (!isValidShortId(shortId)) {
      return res.status(400).json({ message: 'ID produk tidak valid' });
    }
    const product = await Product.findOne({ shortId });
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const { shortId: _ignored, ...data } = req.body;
    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/products/:shortId
const updateProduct = async (req, res) => {
  try {
    const { shortId } = req.params;
    if (!isValidShortId(shortId)) {
      return res.status(400).json({ message: 'ID produk tidak valid' });
    }
    const { shortId: _ignored, ...updates } = req.body;
    const product = await Product.findOneAndUpdate({ shortId }, updates, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.json(product);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/products/:shortId
const deleteProduct = async (req, res) => {
  try {
    const { shortId } = req.params;
    if (!isValidShortId(shortId)) {
      return res.status(400).json({ message: 'ID produk tidak valid' });
    }
    const product = await Product.findOneAndDelete({ shortId });
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    res.json({ message: 'Produk berhasil dihapus', shortId: product.shortId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
