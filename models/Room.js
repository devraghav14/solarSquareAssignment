const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    meetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }]
});

module.exports = mongoose.model('Room', roomSchema);
