const mongoose = require('mongoose');

const WaterLogSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    ml: Number,
    img: String, // just filename like "water1.png"
    time: String
});

module.exports = mongoose.model('WaterLog', WaterLogSchema);
