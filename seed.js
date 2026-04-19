require('dotenv').config();
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const Product = require('./models/Product');

const products = [
  {
    name: 'Smartphone Pro X',
    description: 'Ponsel flagship dengan kamera 108MP dan layar AMOLED 6.7 inci.',
    price: 8_499_000,
    category: 'elektronik',
    image: 'https://picsum.photos/seed/produk1/400/400',
    stock: 25,
    rating: 4.5,
  },
  {
    name: 'Laptop Ultrabook Air',
    description: 'Laptop tipis ringan untuk produktivitas dan desain.',
    price: 12_999_000,
    category: 'elektronik',
    image: 'https://picsum.photos/seed/produk2/400/400',
    stock: 12,
    rating: 4.7,
  },
  {
    name: 'Kaos Katun Premium',
    description: 'Kaos casual nyaman dipakai sehari-hari, bahan katun combed 30s.',
    price: 149_000,
    category: 'fashion',
    image: 'https://picsum.photos/seed/produk3/400/400',
    stock: 80,
    rating: 4.2,
  },
  {
    name: 'Jaket Denim Classic',
    description: 'Jaket denim dengan potongan timeless, cocok untuk cuaca dingin.',
    price: 459_000,
    category: 'fashion',
    image: 'https://picsum.photos/seed/produk4/400/400',
    stock: 35,
    rating: 4.4,
  },
  {
    name: 'Kopi Arabika Blend 200g',
    description: 'Biji kopi arabika pilihan, roast medium, aroma cokelat dan karamel.',
    price: 89_000,
    category: 'makanan',
    image: 'https://picsum.photos/seed/produk5/400/400',
    stock: 120,
    rating: 4.8,
  },
  {
    name: 'Keripik Singkong Pedas',
    description: 'Camilan renyah dengan bumbu pedas gurih, kemasan 150g.',
    price: 18_500,
    category: 'makanan',
    image: 'https://picsum.photos/seed/produk6/400/400',
    stock: 200,
    rating: 4.0,
  },
  {
    name: 'Tumbler Stainless 500ml',
    description: 'Botol minum isolasi vakum, menjaga suhu panas/dingin hingga 12 jam.',
    price: 125_000,
    category: 'lainnya',
    image: 'https://picsum.photos/seed/produk7/400/400',
    stock: 60,
    rating: 4.3,
  },
  {
    name: 'Set Alat Tulis Kantor',
    description: 'Paket pulpen, pensil, penghapus, dan penggaris dalam kotak organizer.',
    price: 75_000,
    category: 'lainnya',
    image: 'https://picsum.photos/seed/produk8/400/400',
    stock: 45,
    rating: 4.1,
  },
  {
    name: 'Earbuds Wireless ANC',
    description: 'Earbud noise cancelling, baterai hingga 28 jam dengan charging case.',
    price: 1_299_000,
    category: 'elektronik',
    image: 'https://picsum.photos/seed/produk9/400/400',
    stock: 40,
    rating: 4.6,
  },
  {
    name: 'Monitor 27" QHD 165Hz',
    description: 'Panel IPS, HDR400, cocok untuk kerja dan gaming.',
    price: 4_750_000,
    category: 'elektronik',
    image: 'https://picsum.photos/seed/produk10/400/400',
    stock: 8,
    rating: 4.5,
  },
  {
    name: 'Sneakers Urban Runner',
    description: 'Sol empuk, upper breathable, desain minimal untuk aktivitas harian.',
    price: 799_000,
    category: 'fashion',
    image: 'https://picsum.photos/seed/produk11/400/400',
    stock: 55,
    rating: 4.3,
  },
  {
    name: 'Tas Ransel Laptop 15"',
    description: 'Kompartemen laptop terpisah, water resistant, slot USB luar.',
    price: 349_000,
    category: 'fashion',
    image: 'https://picsum.photos/seed/produk12/400/400',
    stock: 28,
    rating: 4.0,
  },
  {
    name: 'Madu Hutan Murni 500g',
    description: 'Madu asli tanpa pemanis buatan, kemasan kaca premium.',
    price: 165_000,
    category: 'makanan',
    image: 'https://picsum.photos/seed/produk13/400/400',
    stock: 70,
    rating: 4.7,
  },
  {
    name: 'Granola Mix Berry 300g',
    description: 'Sarapan sehat dengan oat, kacang, dan buah kering.',
    price: 62_000,
    category: 'makanan',
    image: 'https://picsum.photos/seed/produk14/400/400',
    stock: 90,
    rating: 4.2,
  },
  {
    name: 'Matras Yoga Premium',
    description: 'Permukaan anti slip, ketebalan 6mm, ringan untuk dibawa.',
    price: 199_000,
    category: 'lainnya',
    image: 'https://picsum.photos/seed/produk15/400/400',
    stock: 33,
    rating: 4.4,
  },
  {
    name: 'Lampu Meja LED Dimmable',
    description: 'Suhu warna dapat diatur, port USB untuk charge HP.',
    price: 239_000,
    category: 'lainnya',
    image: 'https://picsum.photos/seed/produk16/400/400',
    stock: 22,
    rating: 4.5,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Terhubung ke MongoDB');

    await Product.deleteMany({});
    console.log('Data produk lama dibersihkan');

    await Product.insertMany(
      products.map((p) => ({ ...p, shortId: nanoid(10) }))
    );
    console.log(`Berhasil menanam ${products.length} produk`);

    await mongoose.connection.close();
    console.log('Koneksi ditutup');
    process.exit(0);
  } catch (err) {
    console.error('Seed gagal:', err.message);
    process.exit(1);
  }
}

seed();
