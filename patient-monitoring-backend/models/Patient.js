const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  patientId: String,
  name: String,
  age: Number,
  caretakerPhone: String
});

module.exports = mongoose.model("Patient", PatientSchema);
