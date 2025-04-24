const WaterLog = require('../models/Water');
const UserState = require('../models/UserState');
const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');

function getTargetAmount(isWarmMode) {
    return isWarmMode ? 2500 : 2000;
}

const home = async (req, res) => {
    const user = req.session.user._id;
    const logs = await WaterLog.find({ user }).lean();
    let state = await UserState.findOne({ user });

    if (!state) {
        state = await UserState.create({ user, currentAmount: 0, isWarmMode: false });
    }

    res.render('main', {
        logs,
        currentAmount: state.currentAmount,
        isWarmMode: state.isWarmMode,
        targetAmount: getTargetAmount(state.isWarmMode),
        isTargetReached: state.currentAmount >= getTargetAmount(state.isWarmMode)
    });
};

const addWater = async (req, res) => {
    const { ml, img } = req.body;
    const user = req.session.user._id;

    const time = dayjs().tz('Asia/Jakarta').format('HH:mm');

    await WaterLog.create({ user, ml, img, time });

    const state = await UserState.findOne({ user });
    state.currentAmount += parseInt(ml);
    await state.save();

    res.redirect('/');
};

const editWater = async (req, res) => {
    const { newMl } = req.body;
    const log = await WaterLog.findById(req.params.id);

    if (log.user.toString() !== req.session.user._id.toString()) {
        return res.status(403).send('Access Denied');  // Jangan izinkan menghapus jika bukan milik pengguna yang login
    }

    const diff = newMl - log.ml;

    log.ml = newMl;
    await log.save();

    const state = await UserState.findOne({ user: req.session.user._id });
    state.currentAmount += diff;
    await state.save();

    res.redirect('/');
};

const deleteWater = async (req, res) => {
    const log = await WaterLog.findById(req.params.id);
    const ml = log.ml;

    if (log.user.toString() !== req.session.user._id.toString()) {
        return res.status(403).send('Access Denied');  // Jangan izinkan menghapus jika bukan milik pengguna yang login
    }

    await WaterLog.findByIdAndDelete(req.params.id);

    const state = await UserState.findOne({ user: req.session.user._id });
    state.currentAmount -= ml;
    await state.save();

    res.redirect('/');
};

const toggleMode = async (req, res) => {
    const state = await UserState.findOne({ user: req.session.user._id });
    state.isWarmMode = !state.isWarmMode;
    await state.save();
    res.redirect('/');
};

const resetAll = async (req, res) => {
    const user = req.session.user._id;
    await WaterLog.deleteMany({ user });
    const state = await UserState.findOne({ user });
    state.currentAmount = 0;
    await state.save();
    res.redirect('/');
};

module.exports = {home,addWater,editWater,deleteWater,toggleMode,resetAll};
