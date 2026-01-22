const mongoose = require("mongoose");

const vitalsSchema = new mongoose.Schema(
  {
    heartRate: Number,
    spo2: Number,
    temperature: Number,
    status: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vitals", vitalsSchema);
