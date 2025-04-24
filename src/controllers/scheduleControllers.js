const Schedule = require('../models/Schedule'); 
const dayjs = require('../utils/dayjsSetup');

// Menampilkan semua jadwal
const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find({user: req.session.user._id});

        // Reminder berdasarkan jenis aktivitas
        const reminderTimes = {
            ringan: 60,  // menit
            sedang: 45,
            berat: 30,
        };

        // Tambahkan waktu reminder ke setiap schedule
        schedules.forEach(schedule => {
            const reminder = reminderTimes[schedule.activityType];
            if (reminder) {
                const reminderTime = new Date(schedule.startTime.getTime() + reminder * 60000);
                schedule.reminderTime = reminderTime.toLocaleString(); // bisa di-render di EJS
            }
        });

        res.render('schedule', { schedules, user: req.session.user._id });
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan dalam mendapatkan jadwal.');
    }
};

// Menambahkan aktivitas baru
const createSchedule = async (req, res) => {
    const { name, startTime, endTime, activityType } = req.body;
    
    // const startTimeUtc = moment(startTime).utc().toDate(); 
    // const endTimeUtc = moment(endTime).utc().toDate(); 

    if(new Date(startTime) >= new Date(endTime)){
        return res.status(400).send('Waktu mulai tidak boleh lebih besar atau sama dengan waktu berakhir.')
    }

    try {
        const newSchedule = new Schedule({
            name,
            startTime: dayjs.tz(startTime, 'Asia/Jakarta').toDate(),
            endTime: dayjs.tz(endTime, 'Asia/Jakarta').toDate(),
            activityType,
            user: req.session.user,
        });

        await newSchedule.save();
        res.redirect('/schedule');
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan dalam menambahkan jadwal.');
    }
};

// Menampilkan form untuk mengedit aktivitas
const getEditSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);

        // const localStartTime = moment(schedule.startTime).local().format('YYYY-MM-DDTHH:mm');
        // const localEndTime = moment(schedule.endTime).local().format('YYYY-MM-DDTHH:mm');

        

        res.render('editschedule', { schedule, dayjs });
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan saat mendapatkan data untuk edit.');
    }
};

// Memperbarui aktivitas yang ada
const updateSchedule = async (req, res) => {
    const { name, startTime, endTime, activityType } = req.body;

    // const startTimeUtc = moment(startTime).utc().toDate();
    // const endTimeUtc = moment(endTime).utc().toDate();


    if(new Date(startTime) >= new Date(endTime)){
        return res.status(400).send('Waktu mulai tidak boleh lebih besar atau sama dengan waktu berakhir.')
    }

    try {
        await Schedule.findOneAndUpdate(
            {_id: req.params.id, user: req.session.user._id }, 
            {
            name,
            startTime: dayjs.tz(startTime, 'Asia/Jakarta').toDate(),
            endTime: dayjs.tz(endTime, 'Asia/Jakarta').toDate(),
            activityType,
        });
        res.redirect('/schedule');
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan dalam memperbarui jadwal.');
    }
};

// Menghapus aktivitas
const deleteSchedule = async (req, res) => {
    try {
        await Schedule.findOneAndDelete({
            _id: req.params.id,
            user: req.session.user._id
        });
        res.redirect('/schedule');
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi kesalahan saat menghapus jadwal.');
    }
};
module.exports = {getAllSchedules, createSchedule, getEditSchedule, updateSchedule, deleteSchedule }