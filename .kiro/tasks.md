# Rencana Implementasi: AC Maintenance Service

## Gambaran Umum

Implementasi dibagi menjadi 3 modul berurutan. Setiap modul berdiri sendiri dan dapat di-deliver secara independen. Database schema sudah tersedia di Supabase — tidak perlu membuat migrasi, cukup connect dan implementasi logika.

---

## Modul 1: Booking System

Modul inti yang mencakup seluruh alur pemesanan service AC, dashboard Admin, dashboard Tim Teknisi, autentikasi, dan analitik.

- [x] 1. Setup fondasi proyek
  - Inisialisasi proyek Next.js dengan JavaScript (`.js`/`.jsx`)
  - Pasang dan konfigurasi Tailwind CSS + DaisyUI
  - Pasang dependensi: `@supabase/supabase-js`, `fast-check`, `jest`, `@testing-library/react`, `@testing-library/jest-dom`
  - Buat file konfigurasi Jest (`jest.config.js`, `jest.setup.js`) dengan `fc.configureGlobal({ numRuns: 100 })`
  - Buat file `lib/supabaseClient.js` (browser client) dan `lib/supabaseAdmin.js` (service role, server-side only)
  - Buat file `styles/globals.css` dengan import Tailwind
  - _Requirements: 6.1, 13.1_

- [x] 2. Implementasi fungsi validasi (`lib/validators.js`)
  - [x] 2.1 Implementasi `validateWhatsappNumber(number)` — validasi format nomor WA Indonesia (`08`/`628`, 10–15 digit)
    - _Requirements: 3.4_

  - [x] 2.2 Implementasi `validateEmail(email)` — validasi format email sesuai RFC 5321
    - _Requirements: 3.5_

  - [x] 2.3 Implementasi `validateOrderItem(item)` — validasi `serviceId`, `acCapacity` (enum), dan `unitCount` (integer ≥ 1)
    - Nilai `acCapacity` valid: `0.5_pk`, `0.75_pk`, `1_pk`, `1.5_pk`, `2_pk`, `2.5_pk`
    - _Requirements: 3.2, 3.6_

  - [x] 2.4 Implementasi `validateCustomerInfo(customerInfo)` — validasi field wajib dan format
    - `custName`, `custPhone`, `custLocUrl` wajib diisi; `custEmail` opsional tapi divalidasi jika ada
    - Kembalikan `{ isValid, errors }`
    - _Requirements: 3.3, 3.4, 3.5_

  - [x]* 2.5 Tulis property test untuk `validateWhatsappNumber`
    - **Property 4: Validasi Format Nomor WhatsApp**
    - **Validates: Requirements 3.4**

  - [x]* 2.6 Tulis property test untuk `validateEmail`
    - **Property 5: Validasi Format Email**
    - **Validates: Requirements 3.5**

  - [x]* 2.7 Tulis property test untuk `validateOrderItem`
    - **Property 6: Validasi Unit Count Item**
    - **Validates: Requirements 3.6**

  - [x]* 2.8 Tulis property test untuk `validateCustomerInfo`
    - **Property 3: Validasi Form Order Menolak Field Wajib yang Kosong**
    - **Validates: Requirements 3.3**

- [x] 3. Implementasi logika kuota harian (`lib/quotaChecker.js`)
  - [x] 3.1 Implementasi `calculateDailyUsedUnits(orders)` — hitung total unit dari semua order berstatus bukan `cancelled`
    - _Requirements: 4.1_

  - [x] 3.2 Implementasi `checkQuotaAvailability(usedUnits, newOrderUnits)` — kembalikan `{ allowed, remainingUnits }` berdasarkan batas 20 unit
    - _Requirements: 4.2, 4.3_

  - [x]* 3.3 Tulis property test untuk `calculateDailyUsedUnits`
    - **Property 7: Kalkulasi Kuota Harian Akurat**
    - **Validates: Requirements 4.1**

  - [x]* 3.4 Tulis property test untuk `checkQuotaAvailability`
    - **Property 8: Penerimaan Order Berdasarkan Kuota**
    - **Validates: Requirements 4.2, 4.3**

  - [x]* 3.5 Tulis unit test untuk skenario batas kuota
    - Skenario: tepat 20 unit (diterima), 21 unit (ditolak), 0 unit (diterima)
    - _Requirements: 4.2, 4.3_

- [x] 4. Implementasi pembuatan tautan wa.me (`lib/waLink.js`)
  - [x] 4.1 Implementasi `buildWaLink(order, items, remainingQuota, adminPhone)` — buat URL `wa.me` dengan pesan pre-filled
    - Encode pesan menggunakan `encodeURIComponent`
    - Sertakan dalam pesan: nama customer, nomor WA, URL lokasi, detail semua item (layanan, kapasitas, jumlah unit), total unit, sisa kuota
    - Format: `https://wa.me/{adminPhone}?text={encodedMessage}`
    - _Requirements: 5.1, 5.2_

  - [x]* 4.2 Tulis property test untuk `buildWaLink`
    - **Property 9: Konten Pesan wa.me Lengkap**
    - **Validates: Requirements 5.2**

  - [x]* 4.3 Tulis unit test untuk encoding URL
    - Verifikasi karakter khusus (spasi, newline, tanda baca) ter-encode dengan benar
    - _Requirements: 5.1_

- [x] 5. Implementasi logika transisi status dan assign tim (`lib/statusTransitions.js`)
  - [x] 5.1 Implementasi `validateAdminStatusTransition(currentStatus, newStatus)` — validasi transisi yang diizinkan untuk Admin
    - Izinkan: `Pending→Proses`, `Pending→Batal`, `Proses→Batal`
    - _Requirements: 7.7_
  - [x] 5.2 Implementasi `validateTechnicianStatusTransition(currentStatus, newStatus)` — validasi transisi yang diizinkan untuk Teknisi
    - Izinkan: `Proses→Selesai`
    - _Requirements: 9.4_
  - [x] 5.3 Implementasi `validateConfirmationRequirement(order)` — validasi bahwa order memiliki `team_id` sebelum dikonfirmasi
    - _Requirements: 7.4, 7.5_
  - [x] 5.4 Implementasi `validateAssignTeam(order)` — validasi bahwa assign tim hanya diizinkan pada status `Pending` atau `Proses`
    - _Requirements: 8.4, 8.5_
  - [x]* 5.5 Tulis property test untuk `validateAdminStatusTransition`
    - **Property 12: Transisi Status Order Hanya pada Jalur yang Diizinkan (Admin)**
    - **Validates: Requirements 7.7**
  - [x]* 5.6 Tulis property test untuk `validateConfirmationRequirement`
    - **Property 13: Konfirmasi Order Wajib Ada Assigned Team**
    - **Validates: Requirements 7.4, 7.5**
  - [x]* 5.7 Tulis property test untuk `validateAssignTeam`
    - **Property 15: Assign Tim Hanya Diizinkan pada Status Pending atau Confirmed**
    - **Validates: Requirements 8.4, 8.5**
  - [x]* 5.8 Tulis property test untuk `validateTechnicianStatusTransition`
    - **Property 17: Transisi Status oleh Teknisi Hanya pada Jalur yang Diizinkan**
    - **Validates: Requirements 9.4**
  - [x]* 5.9 Tulis unit test untuk setiap transisi valid dan invalid secara eksplisit
    - _Requirements: 7.7, 9.4_

- [x] 6. Implementasi fungsi filter order (`lib/orderFilters.js`)
  - [x] 6.1 Implementasi `filterOrders(orders, criteria)` — filter berdasarkan status dan/atau rentang tanggal
    - _Requirements: 7.3_
  - [x]* 6.2 Tulis property test untuk `filterOrders`
    - **Property 11: Filter Order Mengembalikan Hasil yang Sesuai Kriteria**
    - **Validates: Requirements 7.3**

- [x] 7. Implementasi fungsi analitik (`lib/analytics.js`)
  - [x] 7.1 Implementasi `aggregateDailyOrderTrend(orders)` — kelompokkan order per hari dan per minggu
    - _Requirements: 11.1_

  - [x] 7.2 Implementasi `aggregatePopularServices(orderItems)` — urutkan layanan berdasarkan frekuensi `service_id` secara descending
    - _Requirements: 11.2_

  - [x] 7.3 Implementasi `aggregateTeamProductivity(orders, orderItems, period)` — hitung jumlah order `done` dan total unit per tim dalam periode
    - _Requirements: 11.3_

  - [x] 7.4 Implementasi `groupRepeatCustomers(orders)` — kelompokkan berdasarkan `cust_email` (fallback ke `cust_phone`)
    - _Requirements: 11.4_

  - [x] 7.5 Implementasi `calculateQuotaUtilization(orders, period)` — hitung rata-rata utilisasi kuota harian dalam persentase
    - _Requirements: 11.5_

  - [x] 7.6 Implementasi `filterByDateRange(data, startDate, endDate)` — filter data analitik berdasarkan rentang tanggal
    - _Requirements: 11.6_

  - [x]* 7.7 Tulis property test untuk `aggregateDailyOrderTrend`
    - **Property 19: Agregasi Analitik Per Hari Akurat**
    - **Validates: Requirements 11.1**

  - [x]* 7.8 Tulis property test untuk `aggregatePopularServices`
    - **Property 20: Layanan Terpopuler Diurutkan Berdasarkan Frekuensi**
    - **Validates: Requirements 11.2**

  - [x]* 7.9 Tulis property test untuk `aggregateTeamProductivity`
    - **Property 21: Produktivitas Tim Dihitung dengan Benar**
    - **Validates: Requirements 11.3**

  - [x]* 7.10 Tulis property test untuk `groupRepeatCustomers`
    - **Property 22: Pengelompokan Customer Berulang**
    - **Validates: Requirements 11.4**

  - [x]* 7.11 Tulis property test untuk `calculateQuotaUtilization`
    - **Property 23: Utilisasi Kuota Harian Dihitung dengan Benar**
    - **Validates: Requirements 11.5**

  - [x]* 7.12 Tulis property test untuk `filterByDateRange`
    - **Property 24: Filter Tanggal Analitik Mengembalikan Data dalam Rentang yang Benar**
    - **Validates: Requirements 11.6**

- [x] 8. Checkpoint — Pastikan semua unit test dan property test pada lib/ lulus
  - Pastikan semua tes lulus, tanyakan kepada pengguna jika ada pertanyaan.

- [x] 9. Implementasi API Routes — Kuota dan Order
  - [x] 9.1 Implementasi `GET /api/quota` — kembalikan `{ date, usedUnits, remainingUnits, maxUnits: 20 }`
    - Query parameter `?date=YYYY-MM-DD` (default: hari ini), query ke Supabase menggunakan `created_at::date`
    - _Requirements: 4.4_

  - [x] 9.2 Implementasi `POST /api/orders` — buat order baru dengan pengecekan kuota dan generate tautan wa.me
    - Validasi server-side menggunakan `validators.js`
    - Cek kuota menggunakan `quotaChecker.js` (query Supabase)
    - INSERT ke tabel `orders` dan `order_items` dalam satu transaksi Supabase
    - Generate tautan `wa.me` menggunakan `waLink.js` dan sertakan dalam response
    - Kembalikan 201 (dengan `waLink`), 400, atau 422 sesuai spesifikasi
    - _Requirements: 3.3, 4.1, 4.2, 4.3, 5.1, 5.2_

  - [x] 9.3 Implementasi `GET /api/orders` — daftar order (Admin: semua; Teknisi: hanya milik tim sendiri)
    - Validasi autentikasi dan role dari Supabase Auth
    - _Requirements: 7.1, 9.1, 13.1_

  - [x] 9.4 Implementasi `GET /api/orders/[id]` — detail order beserta semua item
    - Validasi akses: Teknisi hanya boleh mengakses order milik timnya
    - _Requirements: 7.2, 9.2, 9.5_

  - [x] 9.5 Implementasi `PATCH /api/orders/[id]` — update status atau assign tim
    - Tangani dua aksi: `update_status` dan `assign_team`
    - Validasi transisi status menggunakan `statusTransitions.js`
    - Validasi RBAC: Admin vs Teknisi
    - Tolak perubahan `order_items` dengan error `IMMUTABLE_ITEM`
    - _Requirements: 7.4, 7.5, 7.6, 7.7, 8.2, 8.3, 8.4, 8.5, 9.3, 9.4, 10.1, 10.2_

  - [x]* 9.6 Tulis property test untuk RBAC di API Routes
    - **Property 26: RBAC Berlaku di Semua Endpoint API**
    - **Validates: Requirements 13.1, 13.3, 13.4**

  - [x]* 9.7 Tulis property test untuk immutabilitas item order
    - **Property 18: Item Order Tidak Dapat Diubah Setelah Tersimpan**
    - **Validates: Requirements 10.1, 10.2**

  - [x]* 9.8 Tulis property test untuk akses order oleh Teknisi
    - **Property 16: Teknisi Hanya Melihat dan Mengupdate Order Milik Timnya**
    - **Validates: Requirements 9.1, 9.3, 9.5**

- [x] 10. Implementasi API Routes — Layanan dan Pengguna
  - [x] 10.1 Implementasi `GET /api/services` — daftar semua layanan dari Supabase
    - _Requirements: 12.1_

  - [x] 10.2 Implementasi `POST /api/services` dan `PATCH /api/services/[id]` — tambah dan ubah layanan (Admin only)
    - _Requirements: 12.1_

  - [x] 10.3 Implementasi `GET /api/users` — daftar tim teknisi (Admin only), query `user_details` dengan `role = 'teknisi'`
    - _Requirements: 8.1, 12.3_

  - [x] 10.4 Implementasi `POST /api/users` dan `PATCH /api/users/[id]` — tambah dan kelola akun Tim Teknisi (Admin only)
    - _Requirements: 12.3_

- [x] 11. Implementasi autentikasi dan proteksi rute
  - [x] 11.1 Buat hook `hooks/useAuth.js` — kelola sesi Supabase Auth, expose `user`, `role`, `signIn`, `signOut`
    - Ambil role dari tabel `user_details` setelah login; sertakan logika session timeout 8 jam
    - _Requirements: 6.2, 6.4, 6.5, 13.5_

  - [x] 11.2 Buat komponen `components/shared/ProtectedRoute.jsx` — HOC yang memproteksi halaman dashboard
    - Redirect ke `/login` jika tidak ada sesi; tampilkan 403 jika role tidak sesuai
    - _Requirements: 6.6, 13.2, 13.3_

  - [x] 11.3 Buat halaman `pages/login.jsx` — form login dengan email dan password via Supabase Auth
    - Tampilkan pesan error generik untuk kredensial tidak valid
    - _Requirements: 6.1, 6.2, 6.3_

  - [x]* 11.4 Tulis property test untuk `ProtectedRoute`
    - **Property 10: Akses Dashboard Tanpa Autentikasi Diarahkan ke Login**
    - **Validates: Requirements 6.6, 13.2**

- [x] 12. Implementasi komponen shared dashboard
  - [ ] 12.1 Buat komponen `components/shared/Layout.jsx` dan `components/shared/DashboardLayout.jsx`
    - DashboardLayout menyertakan sidebar navigasi dan header dengan tombol logout
    - _Requirements: 6.5_

  - [x] 12.2 Buat komponen `components/dashboard/StatusBadge.jsx` — badge warna berdasarkan status order
    - _Requirements: 7.1_

  - [x] 12.3 Buat komponen `components/dashboard/OrderTable.jsx` — tabel order dengan kolom: nama customer, WA, lokasi, status, timestamp, tim
    - Sertakan filter berdasarkan status dan tanggal
    - _Requirements: 7.1, 7.3_

  - [x] 12.4 Buat komponen `components/dashboard/OrderDetail.jsx` — tampilan detail order beserta semua item
    - _Requirements: 7.2, 9.2_

  - [x] 12.5 Buat komponen `components/dashboard/AssignTeamModal.jsx` — modal untuk assign Tim Teknisi ke order
    - Tampilkan daftar Tim Teknisi yang tersedia dari `GET /api/users`
    - _Requirements: 8.1, 8.2_

  - [x] 12.6 Buat komponen `components/dashboard/StatusUpdateModal.jsx` — modal konfirmasi perubahan status order
    - _Requirements: 7.4, 7.7_

- [x] 13. Implementasi Dashboard Admin
  - [x] 13.1 Buat hook `hooks/useOrders.js` — fetch daftar order dengan filter dan Supabase Realtime subscription
    - _Requirements: 7.1, 7.3_

  - [x] 13.2 Buat halaman `pages/dashboard/admin/index.jsx` — daftar semua order dengan filter status dan tanggal
    - Proteksi dengan `ProtectedRoute` role `admin`
    - _Requirements: 7.1, 7.3, 13.1_

  - [x] 13.3 Buat halaman `pages/dashboard/admin/orders/[id].jsx` — detail order dengan aksi assign tim dan update status
    - Tampilkan pesan bahwa item order tidak dapat diubah
    - _Requirements: 7.2, 7.4, 7.5, 7.6, 7.7, 8.2, 8.3, 8.4, 8.5, 10.3_

  - [x] 13.4 Buat halaman `pages/dashboard/admin/settings/services.jsx` — manajemen jenis layanan (tambah, ubah)
    - _Requirements: 12.1_

  - [x] 13.5 Buat halaman `pages/dashboard/admin/settings/teams.jsx` — manajemen akun Tim Teknisi (tambah, kelola)
    - _Requirements: 12.3_

- [x] 14. Implementasi komponen analitik dan halaman analitik Admin
  - [x] 14.1 Buat komponen `components/dashboard/analytics/OrderTrendChart.jsx` — grafik tren volume order per hari dan per minggu
    - _Requirements: 11.1_

  - [x] 14.2 Buat komponen `components/dashboard/analytics/PopularServicesChart.jsx` — grafik layanan terpopuler
    - _Requirements: 11.2_

  - [x] 14.3 Buat komponen `components/dashboard/analytics/TeamProductivityTable.jsx` — tabel produktivitas tim teknisi
    - _Requirements: 11.3_

  - [x] 14.4 Buat komponen `components/dashboard/analytics/QuotaUtilizationChart.jsx` — grafik rata-rata utilisasi kuota harian
    - _Requirements: 11.5_

  - [x] 14.5 Buat halaman `pages/dashboard/admin/analytics.jsx` — rakit semua komponen analitik dengan filter rentang tanggal
    - Proteksi dengan `ProtectedRoute` role `admin`
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [x] 15. Implementasi Dashboard Tim Teknisi
  - [x] 15.1 Buat halaman `pages/dashboard/teknisi/index.jsx` — daftar order yang di-assign ke tim sendiri
    - Proteksi dengan `ProtectedRoute` role `teknisi`
    - Sembunyikan fitur assign, hapus, dan daftar order tim lain
    - _Requirements: 9.1, 9.6, 13.1_

  - [x] 15.2 Buat halaman `pages/dashboard/teknisi/orders/[id].jsx` — detail order dengan aksi update status
    - Izinkan transisi `confirmed→in_progress` dan `in_progress→done` saja
    - Tolak akses ke order yang bukan milik tim sendiri
    - _Requirements: 9.2, 9.3, 9.4, 9.5_

- [x] 16. Implementasi Form Order Publik (entry point Modul 1)
  - [x] 16.1 Buat hook `hooks/useQuota.js` — fetch sisa kuota harian dari `GET /api/quota` dan refresh berkala
    - _Requirements: 4.4_

  - [x] 16.2 Buat komponen `components/public/OrderForm.jsx` — form multi-item dengan validasi client-side
    - Tampilkan sisa kuota harian di atas form
    - Field customer: nama, nomor WA, email (opsional), URL lokasi
    - Daftar item: tambah/hapus item, tiap item berisi jenis layanan, kapasitas AC, jumlah unit
    - Validasi menggunakan `validators.js` sebelum submit
    - Setelah submit berhasil: tampilkan konfirmasi sukses dan buka tautan `wa.me` di tab baru
    - Tampilkan pesan error kuota penuh jika ditolak
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.2, 4.3, 4.4, 5.1, 5.3, 5.4_

  - [x] 16.3 Buat halaman `pages/order.jsx` — halaman form order publik, dapat diakses tanpa autentikasi
    - _Requirements: 3.1_

- [x] 17. Checkpoint Modul 1 — Pastikan semua tes lulus dan booking system terintegrasi end-to-end
  - Pastikan semua tes lulus, tanyakan kepada pengguna jika ada pertanyaan.

---

## Modul 2: Freon Simulator

Fitur kalkulator perbandingan freon yang berdiri sendiri di halaman publik.

- [ ] 18. Implementasi logika kalkulasi freon (`lib/freonCalculator.js`)
  - [ ] 18.1 Implementasi fungsi `hitungPenghematanAC(pk, jumlahUnit, tarifKwh, jamPerHari)`
    - Tegangan: 220V; faktor arus konvensional: 4.0 A/PK; faktor arus smat-trik: 2.9 A/PK; 30 hari/bulan
    - Kembalikan `{ dayaKonv, dayaSmat, biayaKonv, biayaSmat, hematNominal, hematPersen }`
    - _Requirements: 2.2, 2.3_

  - [ ]* 18.2 Tulis property test untuk `hitungPenghematanAC`
    - **Property 1: Kalkulasi Freon Menghasilkan Nilai yang Benar dan Konsisten**
    - **Validates: Requirements 2.2, 2.3**

  - [ ]* 18.3 Tulis property test untuk validasi input simulator freon
    - **Property 2: Validasi Input Simulator Menolak Nilai Tidak Valid**
    - **Validates: Requirements 2.4**

  - [ ]* 18.4 Tulis unit test untuk `hitungPenghematanAC`
    - Contoh konkret: 1 PK, 1 unit, Rp 1.500/kWh, 8 jam/hari → `dayaKonv=880W`, `dayaSmat=638W`, `hematPersen="27.5"`
    - _Requirements: 2.2, 2.3_

- [ ] 19. Implementasi komponen Simulator Freon
  - [ ] 19.1 Buat komponen `components/public/FreonSimulator.jsx` — form input dan tampilan hasil perbandingan
    - Input: kapasitas AC (PK), jam pemakaian/hari, tarif listrik/kWh
    - Tampilkan hasil berdampingan: konsumsi konvensional vs hemat energi dan selisih biaya bulanan
    - Validasi input client-side; tampilkan pesan error inline untuk nilai tidak valid
    - Gunakan `freonCalculator.js` untuk kalkulasi
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 20. Checkpoint Modul 2 — Pastikan simulator freon berfungsi dan tes lulus
  - Pastikan semua tes lulus, tanyakan kepada pengguna jika ada pertanyaan.

---

## Modul 3: Public Page

Halaman company profile yang menjadi wajah publik aplikasi.

- [ ] 21. Implementasi komponen halaman publik
  - [ ] 21.1 Buat komponen `components/public/Navbar.jsx` — navigasi publik dengan link ke form order dan simulator freon
    - _Requirements: 1.2_

  - [ ] 21.2 Buat komponen `components/public/HeroSection.jsx` — hero section dengan tagline perusahaan dan CTA menuju form order
    - _Requirements: 1.1_

  - [ ] 21.3 Buat komponen `components/public/ServiceList.jsx` — daftar layanan yang diambil dari `GET /api/services`
    - _Requirements: 1.1_

- [ ] 22. Implementasi halaman utama publik
  - [ ] 22.1 Buat halaman `pages/index.jsx` — rakit semua komponen publik: Navbar, HeroSection, ServiceList, FreonSimulator
    - Halaman dapat diakses tanpa autentikasi
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 23. Checkpoint Modul 3 — Pastikan halaman publik tampil dengan benar dan semua tes lulus
  - Pastikan semua tes lulus, tanyakan kepada pengguna jika ada pertanyaan.

---

## Catatan

- Tugas yang ditandai `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Database schema sudah tersedia di Supabase — tidak perlu membuat migrasi atau DDL
- Notifikasi WA menggunakan `wa.me` deep link, tidak ada dependency ke API eksternal
- Setiap tugas mereferensikan requirements spesifik untuk keterlacakan
- Property test memvalidasi properti kebenaran universal menggunakan `fast-check` dengan minimum 100 iterasi
- Semua kode menggunakan JavaScript (`.js`/`.jsx`) — tidak ada TypeScript
