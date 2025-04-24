const mongoose = require('mongoose');
const User = require("../models/User");

const scheduleSchema = new mongoose.Schema({
    name: String,
    startTime: Date,
    endTime: Date,
    activityType: {
        type: String,
        enum: ['ringan', 'sedang', 'berat'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
