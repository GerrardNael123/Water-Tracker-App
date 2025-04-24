const Schedule = require('../models/Schedule');

async function checkScheduleAccess(req, res, next) {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) {
            return res.status(404).send('Jadwal tidak ditemukan');
        }

        // Cek apakah data milik user yang sedang login
        if (schedule.user.toString() !== req.session.user._id) {
            return res.status(403).send('Akses ditolak');
        }

        // Lolos, teruskan ke controller
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).send('Terjadi kesalahan server');
    }
}

module.exports = {checkScheduleAccess};
