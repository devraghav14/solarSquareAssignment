require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const meetingRoutes = require("./routes/meetingRoute.routes.js");
const roomRoutes = require("./routes/room.routes.js");

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGOOSE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the database.."))
  .catch((err) => "MongoDB Connection error.");

const PORT = 3000;

// app.use("/", (req, res) => {
//   res.json({
//     message: "localhost:3000",
//   });
// });


app.use("/api/meetings", meetingRoutes);
app.use("/api/rooms", roomRoutes);

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
