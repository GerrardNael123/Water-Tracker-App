const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone (Jakarta/GMT+7)
dayjs.tz.setDefault('Asia/Jakarta');

module.exports = dayjs;
