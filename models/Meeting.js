const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    date: { type: String, required: true }, 
    startTime: { type: String, required: true }, 
    endTime: { type: String, required: true },
});

module.exports = mongoose.model('Meeting', meetingSchema);
