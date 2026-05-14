requirement API  

  register,
  login,
  getMe,



JSON
  {
    name: 'Test User',
    email: 'test@example.com',
    password: '12345678',
  }


Product
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,

  JSON
  {
    name: 'Smartphone Pro X',
    description: 'Ponsel flagship dengan kamera 108MP dan layar AMOLED 6.7 inci.',
    price: 8_499_000,
    category: 'elektronik',
    image: 'https://picsum.photos/seed/produk1/400/400',
    stock: 25,
    rating: 4.5,
  },


Cart

  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,

  json nya kurang lebih sama kaya product, bisa cek cart controller