# Dokumen Requirements

## Pendahuluan

Web app layanan service AC yang menyediakan halaman publik (company profile) dan sistem booking service AC. Aplikasi ini dirancang sebagai sistem operasional ringan untuk mengelola order service AC, komunikasi ke teknisi, dan analisis dasar. Aplikasi ini **tidak** mencakup fitur pembayaran, penjadwalan otomatis, maupun akun customer.

Produk unggulan yang dipromosikan adalah freon hemat energi (smart-trik), dengan fitur simulator perbandingan freon konvensional vs freon hemat energi sebagai daya tarik utama halaman publik.

---

## Glosarium

- **System**: Keseluruhan aplikasi web AC Maintenance Service
- **Customer**: Pengguna publik yang mengisi form order tanpa memiliki akun
- **Admin**: Pengguna dengan akses penuh ke dashboard — mengelola order, assign tim, dan melihat analisis
- **Tim_Teknisi**: Pengguna dengan akses terbatas ke dashboard — hanya melihat dan mengupdate order yang di-assign ke timnya
- **Order**: Permintaan layanan service AC yang diajukan oleh Customer, berisi satu atau lebih Item
- **Item**: Satu baris dalam Order yang merepresentasikan kombinasi layanan + kapasitas AC + jumlah unit
- **Unit**: Satuan penghitungan kuota harian, dihitung dari `unit_count` tiap Item dalam Order
- **Kuota_Harian**: Batas maksimal total unit yang dapat diterima dalam satu hari kalender (maksimal 20 unit)
- **Status_Order**: Tahapan siklus hidup Order: `pending`, `confirmed`, `in_progress`, `done`, `cancelled`
- **Notifikasi_WA**: Tautan `wa.me` yang dibuka di browser Customer setelah order berhasil disimpan, berisi pesan pre-filled yang dikirim ke nomor Admin
- **Simulator_Freon**: Fitur kalkulator interaktif yang membandingkan konsumsi energi freon konvensional vs freon hemat energi
- **Validator**: Komponen sistem yang memvalidasi input form dan aturan bisnis
- **Notifikator**: Komponen sistem yang membuat tautan `wa.me` dan mengarahkan Customer untuk mengirim pesan ke Admin
- **Analitik**: Komponen sistem yang mengolah dan menyajikan data ringkasan di dashboard Admin

---

## Requirements

### Requirement 1: Halaman Publik (Company Profile)

**User Story:** Sebagai Customer, saya ingin melihat informasi perusahaan dan layanan yang tersedia, sehingga saya dapat memahami layanan AC yang ditawarkan sebelum melakukan pemesanan.

#### Acceptance Criteria

1. THE System SHALL menampilkan halaman publik yang berisi profil perusahaan, daftar layanan, dan informasi produk freon hemat energi.
2. THE System SHALL menyediakan navigasi ke halaman form order dari halaman publik.
3. THE System SHALL menampilkan halaman publik tanpa memerlukan autentikasi dari pengunjung.

---

### Requirement 2: Simulator Perbandingan Freon

**User Story:** Sebagai Customer, saya ingin membandingkan konsumsi energi freon konvensional dan freon hemat energi, sehingga saya dapat memahami potensi penghematan energi sebelum memutuskan menggunakan layanan.

#### Acceptance Criteria

1. THE Simulator_Freon SHALL menerima input berupa kapasitas AC (dalam PK atau BTU), jam pemakaian per hari, dan tarif listrik per kWh.
2. WHEN Customer memasukkan data input yang valid, THE Simulator_Freon SHALL menghitung dan menampilkan estimasi konsumsi listrik bulanan untuk freon konvensional dan freon hemat energi secara berdampingan.
3. WHEN Customer memasukkan data input yang valid, THE Simulator_Freon SHALL menampilkan estimasi selisih biaya listrik bulanan antara kedua jenis freon.
4. IF Customer memasukkan nilai input yang tidak valid (bukan angka positif atau melebihi batas wajar), THEN THE Validator SHALL menampilkan pesan kesalahan yang menjelaskan format input yang benar.
5. THE Simulator_Freon SHALL dapat diakses dari halaman publik tanpa memerlukan autentikasi.

---

### Requirement 3: Form Order oleh Customer

**User Story:** Sebagai Customer, saya ingin mengisi form pemesanan service AC secara online, sehingga saya dapat mengajukan permintaan layanan tanpa harus datang langsung ke kantor.

#### Acceptance Criteria

1. THE System SHALL menyediakan form order publik yang memuat field: nama lengkap, nomor WhatsApp, email (opsional), URL lokasi, dan daftar Item.
2. THE System SHALL mengizinkan Customer menambahkan lebih dari satu Item dalam satu Order, di mana tiap Item terdiri dari: jenis layanan, kapasitas AC, dan jumlah unit.
3. WHEN Customer mengisi form order, THE Validator SHALL memvalidasi bahwa nama lengkap, nomor WhatsApp, URL lokasi, dan minimal satu Item telah diisi sebelum form dapat disubmit.
4. IF Customer mengisi nomor WhatsApp dengan format yang tidak valid, THEN THE Validator SHALL menampilkan pesan kesalahan yang menjelaskan format nomor WhatsApp yang benar.
5. IF Customer mengisi email, THEN THE Validator SHALL memvalidasi bahwa format email sesuai standar RFC 5321 sebelum form dapat disubmit.
6. WHEN Customer menambahkan Item, THE Validator SHALL memastikan jumlah unit pada tiap Item adalah bilangan bulat positif minimal 1.

---

### Requirement 4: Pengecekan dan Penerimaan Kuota Harian

**User Story:** Sebagai Customer, saya ingin mengetahui secara langsung apakah order saya dapat diterima hari ini, sehingga saya tidak perlu menunggu konfirmasi manual untuk mengetahui ketersediaan slot.

#### Acceptance Criteria

1. WHEN Customer menekan tombol submit form order, THE System SHALL menghitung total unit dari semua Item dalam Order yang akan disubmit ditambah total unit dari semua Order berstatus selain `cancelled` pada hari kalender yang sama.
2. IF total unit hasil perhitungan melebihi 20 unit, THEN THE System SHALL menolak Order dan menampilkan pesan kepada Customer bahwa kuota harian telah penuh beserta informasi untuk menghubungi admin.
3. WHEN total unit hasil perhitungan tidak melebihi 20 unit, THE System SHALL menyimpan Order dengan status `pending` dan menampilkan konfirmasi keberhasilan kepada Customer.
4. THE System SHALL menampilkan sisa kuota harian yang tersedia pada halaman form order sebelum Customer melakukan submit.
5. WHEN Order berhasil disimpan dengan status `pending`, THE Notifikator SHALL mengirimkan Notifikasi_WA ke Admin secara otomatis.

---

### Requirement 5: Notifikasi WhatsApp ke Admin

**User Story:** Sebagai Customer, saya ingin dapat langsung mengirim pesan WhatsApp ke Admin setelah order berhasil disimpan, sehingga Admin segera mengetahui ada order baru masuk.

#### Acceptance Criteria

1. WHEN Order baru berhasil disimpan dengan status `pending`, THE System SHALL menampilkan tautan `wa.me` yang mengarahkan Customer ke WhatsApp dengan pesan pre-filled ke nomor Admin.
2. THE Notifikator SHALL menyertakan informasi berikut dalam pesan pre-filled: nama Customer, nomor WhatsApp Customer, URL lokasi, detail semua Item (jenis layanan, kapasitas AC, jumlah unit per item), total unit Order, dan sisa kuota harian setelah Order ini diterima.
3. THE System SHALL membuka tautan `wa.me` di tab baru sehingga Customer dapat mengirim pesan tanpa meninggalkan halaman konfirmasi order.
4. THE System SHALL menampilkan pesan konfirmasi order yang berhasil disimpan beserta tautan `wa.me` tersebut, meskipun Customer memilih untuk tidak mengklik tautan.

---

### Requirement 6: Autentikasi Admin dan Tim Teknisi

**User Story:** Sebagai Admin dan Tim Teknisi, saya ingin login ke dashboard dengan kredensial yang aman, sehingga hanya pengguna yang berwenang yang dapat mengakses dan mengelola data order.

#### Acceptance Criteria

1. THE System SHALL menyediakan halaman login yang meminta username dan password untuk Admin dan Tim_Teknisi.
2. WHEN Admin atau Tim_Teknisi memasukkan kredensial yang valid, THE System SHALL memberikan akses ke dashboard sesuai dengan peran masing-masing.
3. IF Admin atau Tim_Teknisi memasukkan kredensial yang tidak valid, THEN THE System SHALL menampilkan pesan kesalahan generik tanpa mengungkapkan detail spesifik tentang username atau password yang salah.
4. WHILE sesi login aktif, THE System SHALL mempertahankan status autentikasi pengguna.
5. WHEN Admin atau Tim_Teknisi melakukan logout, THE System SHALL mengakhiri sesi dan mengarahkan pengguna ke halaman login.
6. THE System SHALL membatasi akses ke semua halaman dashboard hanya untuk pengguna yang telah terautentikasi.

---

### Requirement 7: Dashboard Admin — Manajemen Order

**User Story:** Sebagai Admin, saya ingin melihat dan mengelola semua order yang masuk, sehingga saya dapat memantau status layanan dan memastikan setiap order ditangani dengan tepat.

#### Acceptance Criteria

1. WHILE Admin terautentikasi, THE System SHALL menampilkan daftar semua Order beserta detail header (nama Customer, nomor WhatsApp, lokasi, status, timestamp, tim yang di-assign) dan semua Item dalam tiap Order.
2. WHEN Admin memilih sebuah Order, THE System SHALL menampilkan halaman detail Order yang memuat semua informasi header dan daftar Item lengkap.
3. WHILE Admin terautentikasi, THE System SHALL menyediakan kemampuan filter Order berdasarkan status dan tanggal.
4. WHEN Admin mengubah status Order menjadi `confirmed`, THE System SHALL memvalidasi bahwa Order tersebut telah di-assign ke Tim_Teknisi sebelum perubahan status disimpan.
5. IF Admin mencoba mengubah status Order menjadi `confirmed` tanpa assign Tim_Teknisi, THEN THE System SHALL menampilkan pesan kesalahan yang menginformasikan bahwa assign Tim_Teknisi wajib dilakukan terlebih dahulu.
6. WHEN Admin mengubah status Order menjadi `cancelled`, THE System SHALL menyimpan perubahan status beserta timestamp pembatalan.
7. THE System SHALL membatasi perubahan status Order oleh Admin hanya pada transisi yang diizinkan: `pending` → `confirmed`, dan `pending`/`confirmed`/`in_progress` → `cancelled`.

---

### Requirement 8: Dashboard Admin — Assign Tim Teknisi

**User Story:** Sebagai Admin, saya ingin meng-assign order ke tim teknisi yang sesuai, sehingga setiap order dapat dikerjakan oleh tim yang tepat dan bertanggung jawab.

#### Acceptance Criteria

1. WHILE Admin terautentikasi, THE System SHALL menampilkan daftar Tim_Teknisi yang tersedia untuk dipilih saat melakukan assign Order.
2. WHEN Admin meng-assign Tim_Teknisi ke sebuah Order, THE System SHALL menyimpan relasi antara Order dan Tim_Teknisi yang dipilih beserta timestamp assign.
3. WHEN Admin meng-assign Tim_Teknisi ke Order berstatus `pending`, THE System SHALL mengizinkan perubahan status Order menjadi `confirmed`.
4. THE System SHALL mengizinkan Admin mengubah assign Tim_Teknisi pada Order yang berstatus `pending` atau `confirmed`.
5. IF Admin mencoba meng-assign Tim_Teknisi ke Order berstatus `in_progress` atau `done`, THEN THE System SHALL menampilkan pesan kesalahan bahwa assign tidak dapat diubah pada Order yang sedang dikerjakan atau telah selesai.

---

### Requirement 9: Dashboard Tim Teknisi — Lihat dan Update Order

**User Story:** Sebagai Tim Teknisi, saya ingin melihat order yang di-assign ke tim saya dan mengupdate statusnya, sehingga saya dapat mengelola pekerjaan saya sendiri tanpa mengakses data tim lain.

#### Acceptance Criteria

1. WHILE Tim_Teknisi terautentikasi, THE System SHALL menampilkan hanya Order yang di-assign ke tim tersebut.
2. WHEN Tim_Teknisi memilih sebuah Order, THE System SHALL menampilkan detail lengkap Order termasuk semua Item, informasi Customer, dan URL lokasi.
3. WHILE Tim_Teknisi terautentikasi, THE System SHALL membatasi kemampuan update status hanya pada Order yang di-assign ke timnya sendiri.
4. THE System SHALL mengizinkan Tim_Teknisi mengubah status Order hanya pada transisi yang diizinkan: `confirmed` → `in_progress`, dan `in_progress` → `done`.
5. IF Tim_Teknisi mencoba mengakses atau mengubah Order yang tidak di-assign ke timnya, THEN THE System SHALL menolak permintaan tersebut dan menampilkan pesan bahwa akses tidak diizinkan.
6. THE System SHALL menyembunyikan fitur assign, hapus, dan daftar Order tim lain dari tampilan Tim_Teknisi.

---

### Requirement 10: Immutabilitas Item Order

**User Story:** Sebagai Admin, saya ingin memastikan detail item order tidak dapat diubah setelah order masuk, sehingga integritas data layanan yang dipesan tetap terjaga.

#### Acceptance Criteria

1. WHEN Order berhasil disimpan dengan status `pending`, THE System SHALL mengunci semua Item dalam Order sehingga tidak dapat diubah oleh siapapun.
2. IF Admin atau Tim_Teknisi mencoba mengubah Item pada Order yang telah tersimpan, THEN THE System SHALL menolak permintaan tersebut dan menampilkan pesan bahwa item order tidak dapat diubah.
3. THE System SHALL menampilkan informasi kepada Admin bahwa untuk memperbaiki item yang salah, Order harus dibatalkan dan Customer perlu melakukan order ulang.

---

### Requirement 11: Dashboard Admin — Analitik

**User Story:** Sebagai Admin, saya ingin melihat ringkasan analitik operasional, sehingga saya dapat memantau performa layanan dan membuat keputusan operasional yang lebih baik.

#### Acceptance Criteria

1. WHILE Admin terautentikasi, THE Analitik SHALL menampilkan grafik tren volume Order per hari dan per minggu.
2. WHILE Admin terautentikasi, THE Analitik SHALL menampilkan daftar layanan terpopuler berdasarkan frekuensi kemunculan `service_id` pada semua Item Order.
3. WHILE Admin terautentikasi, THE Analitik SHALL menampilkan produktivitas tiap Tim_Teknisi berupa jumlah Order berstatus `done` dan total unit yang diselesaikan per tim dalam periode yang dipilih.
4. WHILE Admin terautentikasi, THE Analitik SHALL mengelompokkan Customer berulang berdasarkan email (jika tersedia) atau nomor WhatsApp sebagai fallback, dan menampilkan jumlah Order per Customer.
5. WHILE Admin terautentikasi, THE Analitik SHALL menampilkan rata-rata utilisasi kuota harian dalam persentase terhadap batas 20 unit per hari.
6. THE Analitik SHALL menyediakan filter rentang tanggal untuk semua metrik analitik.

---

### Requirement 12: Manajemen Data Referensi oleh Admin

**User Story:** Sebagai Admin, saya ingin mengelola data referensi seperti jenis layanan, kapasitas AC, dan daftar tim teknisi, sehingga pilihan yang tersedia di form order dan dashboard selalu akurat dan terkini.

#### Acceptance Criteria

1. WHILE Admin terautentikasi, THE System SHALL menyediakan antarmuka untuk menambah, mengubah, dan menonaktifkan jenis layanan yang tersedia.
2. WHILE Admin terautentikasi, THE System SHALL menyediakan antarmuka untuk menambah, mengubah, dan menonaktifkan pilihan kapasitas AC yang tersedia.
3. WHILE Admin terautentikasi, THE System SHALL menyediakan antarmuka untuk menambah dan mengelola akun Tim_Teknisi.
4. WHEN Admin menonaktifkan jenis layanan atau kapasitas AC, THE System SHALL menyembunyikan pilihan tersebut dari form order Customer tanpa menghapus data historis Order yang sudah ada.
5. THE System SHALL menampilkan hanya jenis layanan dan kapasitas AC yang aktif pada form order Customer.

---

### Requirement 13: Keamanan dan Otorisasi Akses

**User Story:** Sebagai Admin, saya ingin memastikan bahwa setiap pengguna hanya dapat mengakses fitur sesuai perannya, sehingga data order dan informasi operasional terlindungi dari akses yang tidak berwenang.

#### Acceptance Criteria

1. THE System SHALL menerapkan kontrol akses berbasis peran (RBAC) yang membedakan hak akses Admin dan Tim_Teknisi di semua endpoint API dan halaman dashboard.
2. IF pengguna yang tidak terautentikasi mencoba mengakses halaman dashboard, THEN THE System SHALL mengarahkan pengguna tersebut ke halaman login.
3. IF Tim_Teknisi mencoba mengakses endpoint atau halaman yang hanya diizinkan untuk Admin, THEN THE System SHALL menolak permintaan dengan respons HTTP 403 dan menampilkan pesan akses ditolak.
4. THE System SHALL memvalidasi otorisasi pada setiap permintaan API, tidak hanya pada level antarmuka pengguna.
5. WHEN sesi pengguna telah melewati batas waktu tidak aktif selama 8 jam, THE System SHALL mengakhiri sesi secara otomatis dan mengarahkan pengguna ke halaman login.
