const express = require('express');
const router = express.Router();
const Room = require('../models/Room');


// Get all rooms
router.get('/rooms', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Create a new room
router.post('/rooms', async (req, res) => {
    try {
        const { name, capacity } = req.body;
        const newRoom = new Room({ name, capacity });
        await newRoom.save();
        res.status(201).json({ message: "Room created successfully", room: newRoom });
    } catch (error) {
        res.status(500).json({ error: "Failed to create room" });
    }
});

module.exports = router;
