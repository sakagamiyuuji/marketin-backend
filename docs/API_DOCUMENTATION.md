# Marketin Backend — API Documentation

**Base URL:** `http://localhost:3004`  
**Content-Type:** `application/json`  
**Auth:** JWT Bearer Token (`Authorization: Bearer <token>`)

---

## Daftar Isi

1. [Auth](#1-auth)
   - [POST /api/auth/register](#post-apiauthregister)
   - [POST /api/auth/login](#post-apiauthlogin)
   - [GET /api/auth/me](#get-apiauthme)
2. [Products](#2-products)
   - [GET /api/products](#get-apiproducts)
   - [GET /api/products/:shortId](#get-apiproductsshortid)
   - [POST /api/products](#post-apiproducts)
   - [PUT /api/products/:shortId](#put-apiproductsshortid)
   - [DELETE /api/products/:shortId](#delete-apiproductsshortid)
3. [Cart](#3-cart)
   - [GET /api/cart](#get-apicart)
   - [POST /api/cart/items](#post-apicartitems)
   - [PUT /api/cart/items/:shortId](#put-apicartitemsshortid)
   - [DELETE /api/cart/items/:shortId](#delete-apicartitemsshortid)
   - [DELETE /api/cart](#delete-apicart)
4. [Error Responses](#4-error-responses)
5. [Data Models](#5-data-models)
6. [Environment Variables](#6-environment-variables)

---

## 1. Auth

### POST /api/auth/register

Mendaftarkan pengguna baru dan mengembalikan JWT.

**Request Body**

| Field      | Type   | Required | Constraints        |
|------------|--------|----------|--------------------|
| `name`     | string | ✅       | Non-empty          |
| `email`    | string | ✅       | Format email valid |
| `password` | string | ✅       | Min 6 karakter     |

```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "password": "rahasia123"
}
```

**Response 201 — Created**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6648a1f2e4b0c3d5f9a12345",
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "createdAt": "2026-05-14T12:00:00.000Z"
  }
}
```

**Response 400 — Validation / Duplicate Email**

```json
{
  "message": "Email sudah digunakan"
}
```

---

### POST /api/auth/login

Login dan mendapatkan JWT.

**Request Body**

| Field      | Type   | Required |
|------------|--------|----------|
| `email`    | string | ✅       |
| `password` | string | ✅       |

```json
{
  "email": "budi@example.com",
  "password": "rahasia123"
}
```

**Response 200 — OK**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6648a1f2e4b0c3d5f9a12345",
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "createdAt": "2026-05-14T12:00:00.000Z"
  }
}
```

**Response 401 — Invalid Credentials**

```json
{
  "message": "Email atau password salah"
}
```

---

### GET /api/auth/me

Mengambil profil pengguna yang sedang login.

**Headers**

```
Authorization: Bearer <token>
```

**Response 200 — OK**

```json
{
  "user": {
    "id": "6648a1f2e4b0c3d5f9a12345",
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "createdAt": "2026-05-14T12:00:00.000Z"
  }
}
```

**Response 401 — Unauthorized**

```json
{
  "message": "Token tidak valid atau sudah kadaluarsa"
}
```

---

## 2. Products

> Semua endpoint produk **tidak memerlukan autentikasi**.

### GET /api/products

Mengambil daftar semua produk. Mendukung filter dan pencarian.

**Query Parameters**

| Parameter  | Type   | Required | Deskripsi                                                      |
|------------|--------|----------|----------------------------------------------------------------|
| `category` | string | ❌       | Filter by category: `elektronik`, `fashion`, `makanan`, `lainnya` |
| `search`   | string | ❌       | Pencarian pada `name` dan `description` (case-insensitive)     |

**Contoh Request**

```
GET /api/products
GET /api/products?category=elektronik
GET /api/products?search=laptop
GET /api/products?category=elektronik&search=laptop
```

**Response 200 — OK**

```json
[
  {
    "_id": "6648a1f2e4b0c3d5f9a10001",
    "shortId": "abc1234567",
    "name": "Laptop Gaming Pro",
    "description": "Laptop dengan spesifikasi tinggi untuk gaming",
    "price": 15000000,
    "category": "elektronik",
    "image": "https://example.com/images/laptop.jpg",
    "stock": 10,
    "rating": 4.5,
    "createdAt": "2026-05-01T08:00:00.000Z"
  },
  {
    "_id": "6648a1f2e4b0c3d5f9a10002",
    "shortId": "def9876543",
    "name": "Headphone Wireless",
    "description": "Headphone bluetooth dengan noise cancelling",
    "price": 750000,
    "category": "elektronik",
    "image": "https://example.com/images/headphone.jpg",
    "stock": 25,
    "rating": 4.2,
    "createdAt": "2026-05-02T08:00:00.000Z"
  }
]
```

---

### GET /api/products/:shortId

Mengambil detail satu produk berdasarkan `shortId`.

**Path Parameter**

| Parameter | Type   | Constraints                         |
|-----------|--------|-------------------------------------|
| `shortId` | string | 10 karakter alphanumeric + `_` `-`  |

**Contoh Request**

```
GET /api/products/abc1234567
```

**Response 200 — OK**

```json
{
  "_id": "6648a1f2e4b0c3d5f9a10001",
  "shortId": "abc1234567",
  "name": "Laptop Gaming Pro",
  "description": "Laptop dengan spesifikasi tinggi untuk gaming",
  "price": 15000000,
  "category": "elektronik",
  "image": "https://example.com/images/laptop.jpg",
  "stock": 10,
  "rating": 4.5,
  "createdAt": "2026-05-01T08:00:00.000Z"
}
```

**Response 400 — Invalid shortId**

```json
{
  "message": "shortId tidak valid"
}
```

**Response 404 — Not Found**

```json
{
  "message": "Produk tidak ditemukan"
}
```

---

### POST /api/products

Membuat produk baru.

> **Catatan:** Field `shortId` di-generate otomatis oleh server, tidak bisa diisi dari request body.

**Request Body**

| Field         | Type   | Required | Constraints                                          |
|---------------|--------|----------|------------------------------------------------------|
| `name`        | string | ✅       | Non-empty                                            |
| `price`       | number | ✅       | Angka positif                                        |
| `description` | string | ❌       | -                                                    |
| `category`    | string | ❌       | `elektronik` \| `fashion` \| `makanan` \| `lainnya`  |
| `image`       | string | ❌       | URL gambar                                           |
| `stock`       | number | ❌       | Default `0`                                          |
| `rating`      | number | ❌       | Rentang `0–5`, default `0`                           |

```json
{
  "name": "Kemeja Batik Premium",
  "description": "Kemeja batik motif parang dengan bahan katun premium",
  "price": 250000,
  "category": "fashion",
  "image": "https://example.com/images/kemeja-batik.jpg",
  "stock": 50,
  "rating": 4.7
}
```

**Response 201 — Created**

```json
{
  "_id": "6648a1f2e4b0c3d5f9a10010",
  "shortId": "xyz0987654",
  "name": "Kemeja Batik Premium",
  "description": "Kemeja batik motif parang dengan bahan katun premium",
  "price": 250000,
  "category": "fashion",
  "image": "https://example.com/images/kemeja-batik.jpg",
  "stock": 50,
  "rating": 4.7,
  "createdAt": "2026-05-14T12:30:00.000Z"
}
```

---

### PUT /api/products/:shortId

Mengupdate data produk.

> **Catatan:** Field `shortId` tidak bisa diubah meskipun dikirim dalam body.

**Path Parameter:** `shortId` (10 karakter)

**Request Body** — kirim hanya field yang ingin diubah:

```json
{
  "price": 200000,
  "stock": 45
}
```

**Response 200 — OK**

```json
{
  "_id": "6648a1f2e4b0c3d5f9a10010",
  "shortId": "xyz0987654",
  "name": "Kemeja Batik Premium",
  "description": "Kemeja batik motif parang dengan bahan katun premium",
  "price": 200000,
  "category": "fashion",
  "image": "https://example.com/images/kemeja-batik.jpg",
  "stock": 45,
  "rating": 4.7,
  "createdAt": "2026-05-14T12:30:00.000Z"
}
```

---

### DELETE /api/products/:shortId

Menghapus produk berdasarkan `shortId`.

**Response 200 — OK**

```json
{
  "message": "Produk berhasil dihapus",
  "shortId": "xyz0987654"
}
```

---

## 3. Cart

> Semua endpoint cart **memerlukan autentikasi** (`Authorization: Bearer <token>`).

### Struktur Item Cart

Setiap item dalam array `items` memiliki bentuk:

```json
{
  "lineId": "6648c3d5f9a1000100000001",
  "quantity": 2,
  "lineSubtotal": 30000000,
  "product": {
    "_id": "6648a1f2e4b0c3d5f9a10001",
    "shortId": "abc1234567",
    "name": "Laptop Gaming Pro",
    "price": 15000000,
    "image": "https://example.com/images/laptop.jpg",
    "stock": 10,
    "category": "elektronik"
  }
}
```

### Struktur Response Cart

```json
{
  "items": [ ...array of cart items... ],
  "subtotal": 30000000,
  "itemCount": 2,
  "updatedAt": "2026-05-14T13:00:00.000Z"
}
```

---

### GET /api/cart

Mengambil isi cart milik user yang login.

**Headers**

```
Authorization: Bearer <token>
```

**Response 200 — OK (cart berisi item)**

```json
{
  "items": [
    {
      "lineId": "6648c3d5f9a1000100000001",
      "quantity": 2,
      "lineSubtotal": 30000000,
      "product": {
        "_id": "6648a1f2e4b0c3d5f9a10001",
        "shortId": "abc1234567",
        "name": "Laptop Gaming Pro",
        "price": 15000000,
        "image": "https://example.com/images/laptop.jpg",
        "stock": 10,
        "category": "elektronik"
      }
    },
    {
      "lineId": "6648c3d5f9a1000100000002",
      "quantity": 1,
      "lineSubtotal": 750000,
      "product": {
        "_id": "6648a1f2e4b0c3d5f9a10002",
        "shortId": "def9876543",
        "name": "Headphone Wireless",
        "price": 750000,
        "image": "https://example.com/images/headphone.jpg",
        "stock": 25,
        "category": "elektronik"
      }
    }
  ],
  "subtotal": 30750000,
  "itemCount": 3,
  "updatedAt": "2026-05-14T13:00:00.000Z"
}
```

**Response 200 — OK (cart kosong)**

```json
{
  "items": [],
  "subtotal": 0,
  "itemCount": 0,
  "updatedAt": null
}
```

---

### POST /api/cart/items

Menambahkan produk ke cart. Jika produk sudah ada, quantity akan dijumlahkan.

**Headers**

```
Authorization: Bearer <token>
```

**Request Body**

| Field      | Type   | Required | Constraints                          |
|------------|--------|----------|--------------------------------------|
| `shortId`  | string | ✅       | shortId produk yang valid (10 char)  |
| `quantity` | number | ❌       | Integer ≥ 1, default `1`             |

```json
{
  "shortId": "abc1234567",
  "quantity": 2
}
```

**Response 201 — Created** (item baru ditambahkan)

```json
{
  "items": [
    {
      "lineId": "6648c3d5f9a1000100000001",
      "quantity": 2,
      "lineSubtotal": 30000000,
      "product": {
        "_id": "6648a1f2e4b0c3d5f9a10001",
        "shortId": "abc1234567",
        "name": "Laptop Gaming Pro",
        "price": 15000000,
        "image": "https://example.com/images/laptop.jpg",
        "stock": 10,
        "category": "elektronik"
      }
    }
  ],
  "subtotal": 30000000,
  "itemCount": 2,
  "updatedAt": "2026-05-14T13:05:00.000Z"
}
```

**Response 200 — OK** (quantity diupdate karena produk sudah di cart)

> Sama seperti response 201 namun status code 200.

**Response 400 — Stok tidak cukup**

```json
{
  "message": "Stok tidak mencukupi"
}
```

**Response 404 — Produk tidak ditemukan**

```json
{
  "message": "Produk tidak ditemukan"
}
```

---

### PUT /api/cart/items/:shortId

Mengubah quantity item di cart. Menggantikan quantity lama dengan nilai baru.

**Headers**

```
Authorization: Bearer <token>
```

**Path Parameter:** `shortId` produk (10 karakter)

**Request Body**

| Field      | Type   | Required | Constraints   |
|------------|--------|----------|---------------|
| `quantity` | number | ✅       | Integer ≥ 1   |

```json
{
  "quantity": 3
}
```

**Response 200 — OK** — mengembalikan cart terbaru (format sama seperti GET /api/cart)

**Response 400 — Stok tidak cukup**

```json
{
  "message": "Stok tidak mencukupi"
}
```

**Response 404 — Item tidak ada di cart**

```json
{
  "message": "Item tidak ditemukan di cart"
}
```

---

### DELETE /api/cart/items/:shortId

Menghapus satu item dari cart berdasarkan `shortId` produk.

**Headers**

```
Authorization: Bearer <token>
```

**Path Parameter:** `shortId` produk (10 karakter)

**Response 200 — OK** — mengembalikan cart terbaru (format sama seperti GET /api/cart)

---

### DELETE /api/cart

Mengosongkan seluruh isi cart.

**Headers**

```
Authorization: Bearer <token>
```

**Response 200 — OK**

```json
{
  "items": [],
  "subtotal": 0,
  "itemCount": 0,
  "updatedAt": "2026-05-14T13:10:00.000Z"
}
```

---

## 4. Error Responses

### Format Umum Error

```json
{
  "message": "Deskripsi error dalam Bahasa Indonesia"
}
```

### HTTP Status Codes

| Status | Arti                                         |
|--------|----------------------------------------------|
| `200`  | OK                                           |
| `201`  | Created                                      |
| `400`  | Bad Request (validasi gagal, shortId invalid)|
| `401`  | Unauthorized (token tidak ada / tidak valid) |
| `404`  | Not Found (resource tidak ditemukan)         |
| `500`  | Internal Server Error                        |

### 404 Endpoint Tidak Ada

```json
{
  "message": "Endpoint tidak ditemukan"
}
```

---

## 5. Data Models

### User

```
id          : ObjectId (MongoDB)
name        : String  — required
email       : String  — required, unique, format email
password    : String  — hashed bcrypt, tidak dikembalikan di response
createdAt   : Date
updatedAt   : Date
```

### Product

```
_id         : ObjectId (MongoDB)
shortId     : String (10 char nanoid) — immutable, auto-generated
name        : String  — required
description : String
price       : Number  — required
category    : "elektronik" | "fashion" | "makanan" | "lainnya"
image       : String  (URL)
stock       : Number  — default 0
rating      : Number  — 0–5, default 0
createdAt   : Date
```

### Cart

```
user        : ObjectId → User
items[]     :
  product   : ObjectId → Product
  quantity  : Number ≥ 1
createdAt   : Date
updatedAt   : Date
```

---

## 6. Environment Variables

File `.env` yang dibutuhkan di root project:

```env
MONGO_URI=mongodb://localhost:27017/marketin
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
PORT=3004
```

---

## Catatan Tambahan

### CORS

Server mengizinkan request dari:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (React CRA / Next.js)

### shortId

`shortId` adalah identifier pendek 10 karakter yang digunakan sebagai parameter URL untuk produk dan operasi cart. Format: `[a-zA-Z0-9_-]{10}`.

### JWT

Token dikirim dalam header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Token berlaku selama **7 hari** (default).

### Seed Data (Development)

Untuk development, jalankan seed dengan:
```bash
npm run dev
```
Atau manual:
```bash
node seed.js
```

Seed akan membuat **16 produk** sampel dan satu user default:
- Email: `test@example.com`
- Password: `12345678`
