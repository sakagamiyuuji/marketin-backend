const Cart = require('../models/Cart');
const Product = require('../models/Product');
const isValidShortId = require('../utils/isValidShortId');

const PRODUCT_FIELDS = 'shortId name price image stock category';

const emptyCartPayload = () => ({
  items: [],
  subtotal: 0,
  itemCount: 0,
});

async function ensureCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    try {
      cart = await Cart.create({ user: userId, items: [] });
    } catch (err) {
      if (err.code === 11000) {
        cart = await Cart.findOne({ user: userId });
      } else {
        throw err;
      }
    }
  }
  return cart;
}

async function populateCart(cart) {
  return Cart.findById(cart._id).populate('items.product', PRODUCT_FIELDS);
}

function formatCartResponse(cart) {
  const items = [];
  let subtotal = 0;
  let itemCount = 0;

  for (const line of cart.items) {
    if (!line.product) continue;
    const lineSubtotal = line.quantity * line.product.price;
    subtotal += lineSubtotal;
    itemCount += line.quantity;
    items.push({
      lineId: line._id,
      quantity: line.quantity,
      lineSubtotal,
      product: line.product,
    });
  }

  return {
    items,
    subtotal,
    itemCount,
    updatedAt: cart.updatedAt ?? null,
  };
}

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate(
      'items.product',
      PRODUCT_FIELDS
    );
    if (!cart) {
      return res.json(emptyCartPayload());
    }
    res.json(formatCartResponse(cart));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/cart/items  { shortId, quantity? }
const addItem = async (req, res) => {
  try {
    const { shortId, quantity: qtyRaw } = req.body;
    if (!isValidShortId(shortId)) {
      return res.status(400).json({ message: 'ID produk tidak valid.' });
    }

    const product = await Product.findOne({ shortId });
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    const quantity = Math.max(1, parseInt(qtyRaw, 10) || 1);

    const cart = await ensureCart(req.userId);
    const existing = cart.items.find(
      (line) => line.product.toString() === product._id.toString()
    );

    const nextQty = existing ? existing.quantity + quantity : quantity;
    if (nextQty > product.stock) {
      return res.status(400).json({
        message: `Stok tidak mencukupi. Tersedia: ${product.stock}.`,
      });
    }

    if (existing) {
      existing.quantity = nextQty;
    } else {
      cart.items.push({ product: product._id, quantity });
    }

    await cart.save();
    const fresh = await populateCart(cart);
    res.status(existing ? 200 : 201).json(formatCartResponse(fresh));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/cart/items/:shortId  { quantity }
const updateItem = async (req, res) => {
  try {
    const { shortId } = req.params;
    if (!isValidShortId(shortId)) {
      return res.status(400).json({ message: 'ID produk tidak valid.' });
    }

    const product = await Product.findOne({ shortId });
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    const quantity = parseInt(req.body.quantity, 10);
    if (!Number.isFinite(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Jumlah harus bilangan bulat minimal 1.' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Stok tidak mencukupi. Tersedia: ${product.stock}.`,
      });
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Keranjang kosong.' });
    }

    const line = cart.items.find(
      (i) => i.product.toString() === product._id.toString()
    );
    if (!line) {
      return res.status(404).json({ message: 'Item tidak ada di keranjang.' });
    }

    line.quantity = quantity;
    await cart.save();

    const fresh = await populateCart(cart);
    res.json(formatCartResponse(fresh));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/cart/items/:shortId
const removeItem = async (req, res) => {
  try {
    const { shortId } = req.params;
    if (!isValidShortId(shortId)) {
      return res.status(400).json({ message: 'ID produk tidak valid.' });
    }

    const product = await Product.findOne({ shortId });
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Item tidak ada di keranjang.' });
    }

    const before = cart.items.length;
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== product._id.toString()
    );
    if (cart.items.length === before) {
      return res.status(404).json({ message: 'Item tidak ada di keranjang.' });
    }

    await cart.save();
    const fresh = await populateCart(cart);
    res.json(formatCartResponse(fresh));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.json(emptyCartPayload());
    }
    cart.items = [];
    await cart.save();
    const fresh = await populateCart(cart);
    res.json(formatCartResponse(fresh));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};
