const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const productSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      default: () => nanoid(10),
    },
    name: {
      type: String,
      required: [true, 'Nama produk wajib diisi'],
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'Harga wajib diisi'],
    },
    category: {
      type: String,
      enum: {
        values: ['elektronik', 'fashion', 'makanan', 'lainnya'],
        message: 'Kategori tidak valid',
      },
    },
    image: {
      type: String,
    },
    stock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: [0, 'Rating minimal 0'],
      max: [5, 'Rating maksimal 5'],
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model('Product', productSchema);
