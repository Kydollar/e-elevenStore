# Eleven Store (e-elevenStore)

BUSETDAH INI CODE GUA GINI AMAT SUSAH DIMAINTENANCE WKWK
(BUAT DEMO PORTFOLIO DOANG INI)

Modern, fullstack e‑commerce sample project (React + Express/Sequelize).  
README ringkas ini mencakup struktur, cara menjalankan, variabel lingkungan, dan referensi singkat API / file penting.

---

## Badge (opsional)
- Tekan untuk menambahkan CI / lint / coverage badge sesuai pipeline Anda.

---

## Ringkasan
Eleven Store adalah aplikasi toko online lengkap:
- Frontend: React (Create React App), Material UI & Tailwind — sumber: [elevenStore-main/src/index.js](elevenStore-main/src/index.js)
- Backend: Express + Sequelize + MySQL (session based auth) — entry: [serverElevenStore/index.js](serverElevenStore/index.js)

Contoh fitur: produk, keranjang, checkout, billing history, upload bukti pembayaran, manajemen user & payment method.

---

## Fitur Utama
- Autentikasi session (login/register) — controller: [serverElevenStore/app/controllers/Auth.js](serverElevenStore/app/controllers/Auth.js)
- CRUD produk & kategori — controllers: [serverElevenStore/app/controllers/Products.js](serverElevenStore/app/controllers/Products.js), [serverElevenStore/app/controllers/Categories/ProductCategory.js](serverElevenStore/app/controllers/Categories/ProductCategory.js)
- Keranjang & checkout (transaksi) — controllers: [serverElevenStore/app/controllers/Cart.js](serverElevenStore/app/controllers/Cart.js), [`addCheckout`](serverElevenStore/app/controllers/Transaction.js) in [serverElevenStore/app/controllers/Transaction.js](serverElevenStore/app/controllers/Transaction.js)
- Upload bukti pembayaran — controller: [serverElevenStore/app/controllers/ProofOfPayment.js](serverElevenStore/app/controllers/ProofOfPayment.js)
- Middleware auth & role guard — [serverElevenStore/app/middleware/AuthUser.js](serverElevenStore/app/middleware/AuthUser.js), [serverElevenStore/app/middleware/ProductMiddleware.js](serverElevenStore/app/middleware/ProductMiddleware.js)
- Frontend views: checkout, billing, invoice — [elevenStore-main/src/views/Products/Checkout/index.jsx](elevenStore-main/src/views/Products/Checkout/index.jsx), [elevenStore-main/src/views/BillingHistory/index.jsx](elevenStore-main/src/views/BillingHistory/index.jsx), [elevenStore-main/src/views/Invoice/index.jsx](elevenStore-main/src/views/Invoice/index.jsx)

---

## Struktur Proyek (pilih file penting)
- Server: serverElevenStore/
  - [serverElevenStore/index.js](serverElevenStore/index.js) — server bootstrap & proxy raajaongkir
  - [serverElevenStore/app/controllers](serverElevenStore/app/controllers) — logic API
  - [serverElevenStore/app/models](serverElevenStore/app/models) — Sequelize models
  - [serverElevenStore/routes](serverElevenStore/routes) — route definitions
- Client: elevenStore-main/
  - [elevenStore-main/src/index.js](elevenStore-main/src/index.js) — React entry
  - [elevenStore-main/src/components/Layout/index.jsx](elevenStore-main/src/components/Layout/index.jsx)
  - [elevenStore-main/src/views](elevenStore-main/src/views) — halaman aplikasi
  - [elevenStore-main/package.json](elevenStore-main/package.json) — script & deps

---

## Prasyarat
- Node.js >= 16
- npm atau yarn
- Database (MySQL) di konfigurasi [serverElevenStore/config/Database.js](serverElevenStore/config/Database.js)

---

## Setup dan Menjalankan (Development)

1. Clone workspace (sudah ada di local Anda).
2. Backend
   - Masuk ke folder server:
     - cd serverElevenStore
   - Buat file environment (.env) sesuai contoh dan atur DB / SESSION secret:
     - lihat [serverElevenStore/index.js](serverElevenStore/index.js) dan [serverElevenStore/config/Database.js](serverElevenStore/config/Database.js)
   - Install & jalankan (gunakan --legacy-peer-deps untuk menghindari konflik peer dependency):
     ```sh
     npm install --legacy-peer-deps
     npm run dev   # atau npm start sesuai package.json
     ```
3. Frontend
   - Masuk ke folder client:
     - cd elevenStore-main
   - Buat .env dengan REACT_APP_MY_API pointing ke backend, mis. REACT_APP_MY_API=http://localhost:5000/bsi-api
   - Install & jalankan (gunakan --legacy-peer-deps jika npm menolak karena peer deps):
     ```sh
     npm install --legacy-peer-deps
     npm start
     ```

---

## Variabel Lingkungan (contoh)
- Server (.env)
  - DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_DIALECT
  - SESSION_SECRET, PORT
- Client (.env)
  - REACT_APP_MY_API=http://localhost:5000/bsi-api

---

## Skrip Penting
- Backend: lihat [serverElevenStore/package.json](serverElevenStore/package.json)
- Frontend: lihat [elevenStore-main/package.json](elevenStore-main/package.json)
- Build frontend: `npm run build` di folder [elevenStore-main](elevenStore-main)

---

## Endpoint Referensi Singkat
Beberapa route penting (lihat file route & controller untuk detail):
- Auth
  - POST /login — [serverElevenStore/routes/AuthRoute.js](serverElevenStore/routes/AuthRoute.js) -> [serverElevenStore/app/controllers/Auth.js](serverElevenStore/app/controllers/Auth.js)
  - POST /register — [serverElevenStore/app/controllers/Auth.js](serverElevenStore/app/controllers/Auth.js)
- Product & Cart
  - GET/POST product — [serverElevenStore/app/controllers/Products.js](serverElevenStore/app/controllers/Products.js)
  - POST /cart — [serverElevenStore/app/controllers/Cart.js](serverElevenStore/app/controllers/Cart.js)
- Checkout / Transaction
  - POST /checkout — [serverElevenStore/app/controllers/Transaction.js](serverElevenStore/app/controllers/Transaction.js)
- Proof of Payment
  - POST /proof-of-payment — [serverElevenStore/app/controllers/ProofOfPayment.js](serverElevenStore/app/controllers/ProofOfPayment.js)

> Untuk daftar lengkap endpoint lihat folder [serverElevenStore/routes](serverElevenStore/routes).

---

## Best Practices & Catatan Dev
- Gunakan Postman / test.rest (ada [serverElevenStore/test.rest](serverElevenStore/test.rest)) untuk endpoint cepat.
- Upload file disimpan di [serverElevenStore/public](serverElevenStore/public) — periksa batas ukuran & tipe file di controller.
- Routes yang membutuhkan otorisasi memakai middleware di [serverElevenStore/app/middleware/AuthUser.js](serverElevenStore/app/middleware/AuthUser.js).

---

## Deploy
- Frontend: build statis via `npm run build` di [elevenStore-main](elevenStore-main) dan serve statis (mis. Nginx, Surge, Vercel).
- Backend: pastikan env production, gunakan process manager (pm2), dan set secure cookie/session.