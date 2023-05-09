const mongoose = require('mongoose');

module.exports = mongoose.model('sensordata', new mongoose.Schema({
  id: String,
  room_temp: String,
  body_temp: String,
  heartrate: String,
  bpm: String,
  dateandtime: String
}, { collection : 'SensorData' }));