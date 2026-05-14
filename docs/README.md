# Marketin Backend — Docs

## File Dokumentasi

| File | Deskripsi |
|------|-----------|
| [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) | Dokumentasi lengkap semua endpoint, request/response, data model, dan error codes |

## Mock JSON Files

File mock tersedia di folder [`mock/`](./mock/) untuk digunakan sebagai referensi integrasi atau stub di frontend.

### Auth

| File | Deskripsi |
|------|-----------|
| `auth.register.request.json` | Body POST /api/auth/register |
| `auth.register.response.json` | Response 201 register berhasil |
| `auth.login.request.json` | Body POST /api/auth/login |
| `auth.login.response.json` | Response 200 login berhasil |
| `auth.me.response.json` | Response 200 GET /api/auth/me |

### Products

| File | Deskripsi |
|------|-----------|
| `products.list.response.json` | Response 200 GET /api/products (array 8 produk) |
| `products.single.response.json` | Response 200 GET /api/products/:shortId |
| `products.create.request.json` | Body POST /api/products |
| `products.create.response.json` | Response 201 produk baru |
| `products.update.request.json` | Body PUT /api/products/:shortId |
| `products.update.response.json` | Response 200 produk terupdate |
| `products.delete.response.json` | Response 200 produk terhapus |

### Cart

| File | Deskripsi |
|------|-----------|
| `cart.get.response.json` | Response 200 GET /api/cart (cart berisi item) |
| `cart.empty.response.json` | Response 200 GET /api/cart (cart kosong) |
| `cart.addItem.request.json` | Body POST /api/cart/items |
| `cart.addItem.response.json` | Response 201 item ditambahkan ke cart |
| `cart.updateItem.request.json` | Body PUT /api/cart/items/:shortId |
| `cart.updateItem.response.json` | Response 200 setelah update quantity |

### Errors

| File | Deskripsi |
|------|-----------|
| `errors.json` | Semua kemungkinan error response dengan status code |

## Quick Start

```bash
# Clone dan install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env sesuai konfigurasi database

# Jalankan server development (+ seed data otomatis)
npm run dev

# Server berjalan di http://localhost:3004
```

## Default Credentials (Seed)

Setelah menjalankan seed, user berikut tersedia:

```
Email    : test@example.com
Password : 12345678
```
