const express = require('express');
const router = express.Router();
const {getAllSchedules, createSchedule, getEditSchedule, updateSchedule, deleteSchedule} = require('../controllers/scheduleControllers');
const {isAuthenticated } = require('../middleware/authMiddleware'); 
const {checkScheduleAccess} = require('../middleware/scheduleMiddleware')
// Menampilkan semua jadwal
router.get('/schedule', isAuthenticated, getAllSchedules);

// Menambahkan aktivitas baru
router.post('/schedule',isAuthenticated, createSchedule);

// Menampilkan form untuk mengedit aktivitas
router.get('/schedule/edit/:id', checkScheduleAccess, isAuthenticated, getEditSchedule);

// Memperbarui aktivitas yang ada
router.post('/schedule/edit/:id', checkScheduleAccess, isAuthenticated, updateSchedule);

// Menghapus aktivitas
router.post('/schedule/delete/:id', checkScheduleAccess, isAuthenticated, deleteSchedule);

module.exports = router;
