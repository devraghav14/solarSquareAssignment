const express = require("express");
const Meeting = require("../models/Meeting.js");
const Room = require("../models/Room.js");

const router = express.Router();

// Get Available Slots
router.get("/rooms/:roomId/available/:date", async (req, res) => {
  try {
    const { roomId, date } = req.params;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const meetings = await Meeting.find({ room: roomId, date });

    const allSlots = [
      "00:00-01:00", "01:00-02:00", "02:00-03:00", "03:00-04:00",
      "04:00-05:00", "05:00-06:00", "06:00-07:00", "07:00-08:00",
      "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
      "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00",
      "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00",
      "20:00-21:00", "21:00-22:00", "22:00-23:00", "23:00-00:00"
    ];
    
    const bookedSlots = meetings.map((m) => `${m.startTime}-${m.endTime}`);
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    res.json({ date, room: room.name, availableSlots });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Book a Meeting
router.post("/book", async (req, res) => {
  try {
    const { roomId, date, startTime, endTime } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const conflict = await Meeting.findOne({
      room: roomId,
      date,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
      ],
    });

    if (conflict) return res.status(400).json({ error: "Time slot is already booked" });

    const newMeeting = new Meeting({ room: roomId, date, startTime, endTime });
    await newMeeting.save();

    res.status(201).json({ message: "Meeting booked successfully", meeting: newMeeting });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Reschedule Meeting
router.put("/reschedule/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;

    const meeting = await Meeting.findById(id);
    if (!meeting) return res.status(404).json({ error: "Meeting Not Found" });

    const conflict = await Meeting.findOne({
      date: meeting.date,
      _id: { $ne: id },
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });

    if (conflict) return res.status(400).json({ error: "New time is not available" });

    meeting.startTime = startTime;
    meeting.endTime = endTime;
    await meeting.save();

    res.json({ message: "Meeting Rescheduled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Cancel a Meeting
router.delete("/cancel/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ error: "Meeting Not Found" });

    const currentTime = new Date().toLocaleTimeString("en-GB", { hour12: false });

    if (currentTime >= meeting.startTime) {
      return res.status(400).json({ error: "Cannot cancel a meeting that has already started" });
    }

    await meeting.deleteOne();
    res.json({ message: "Meeting Cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
