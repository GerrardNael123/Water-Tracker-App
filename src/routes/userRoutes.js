const express = require('express');
const router = express.Router();
const {profilePage, updateProfile, changePassword, deleteAccount} = require('../controllers/userControllers');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Halaman profil
router.get('/profile', isAuthenticated, profilePage);

// Update data profil (nama, email)
router.post('/profile/update', isAuthenticated, updateProfile);

// Ganti password
router.post('/profile/password', isAuthenticated, changePassword);

// Hapus akun
router.post('/profile/delete', isAuthenticated, deleteAccount);

module.exports = router;