# Website Toko Hj. Anna

Website responsif untuk Toko Jajanan Hj. Anna, dibuat dengan HTML, CSS, JavaScript, dan Bootstrap 5.3. Konsepnya toko/lapak jajanan sederhana di pinggir jalan, bukan restoran. Fitur: filter kategori jajanan, pencarian, keranjang dengan pengaturan jumlah dan total harga, serta bagian foto lapak.

## Menambahkan foto milik toko

Simpan gambar di dalam folder `images/` dengan nama berikut. Jika foto belum ditambahkan, situs menampilkan placeholder bergaya toko jajanan. Gunakan foto asli gerobak/lapak pinggir jalan, etalase sederhana, dan jajanan di wadah jualan agar tampilannya sesuai.

- `toko.jpg` — foto lapak di bagian hero halaman utama.
- `tampilan-toko.jpg` — foto lebar gerobak atau lapak jajanan pinggir jalan.
- `etalase-jajanan.jpg` — foto etalase untuk bagian cerita toko.
- `pisang-goreng.jpg`, `bakwan-sayur.jpg`, `tahu-isi.jpg`, `risol-mayo.jpg`, `cireng.jpg`, `es-teh-manis.jpg` — foto tiap jajanan.

Jika memakai nama atau format gambar berbeda, ubah nilai `src` pada tag `<img>` menu/foto yang sesuai di `index.html`. Sebaiknya gunakan foto JPG/WebP yang sudah dioptimalkan agar halaman cepat dibuka.

## Mengubah data toko dan menu

- Ubah nama/deskripsi, alamat, jam buka, dan nomor kontak langsung di `index.html`.
- Untuk mengubah harga, samakan harga yang terlihat pada kartu menu dengan nilai `data-price` pada tombol tambah.
- Untuk menambahkan menu, salin satu blok `.product-col` di bagian `#productGrid`, lalu ubah nama file foto, kategori (`jajanan`, `gorengan`, atau `minuman`), nama, deskripsi, dan harga.

## Menjalankan

Buka `index.html` di browser. Koneksi internet diperlukan untuk memuat Bootstrap CDN dan Google Fonts. Website dapat dipreview di VS Code memakai ekstensi Live Server.
