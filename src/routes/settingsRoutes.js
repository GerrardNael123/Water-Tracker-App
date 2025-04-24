// // Import express dan path (kalau belum)
// const express = require('express');
// const path = require('path');
// const app = express();

// // Middleware EJS dan folder views
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Untuk parsing form
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public'))); // untuk styles.css

// // Route utama kamu misalnya:
// app.get('/', (req, res) => {
//   res.render('mainpage'); // atau index.ejs
// });

// // === Tambahkan route untuk settings ===
// app.get('/settings', (req, res) => {
//   res.render('settings'); // render settings.ejs
// });

// // (Opsional) Menangani POST kalau kamu ingin simpan ke server
// app.post('/settings', (req, res) => {
//   const { interval } = req.body;
//   console.log("Interval yang disimpan:", interval); // Bisa disimpan ke file/DB jika mau
//   res.redirect('/settings');
// });

