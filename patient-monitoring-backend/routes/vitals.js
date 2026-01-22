const express = require("express");
const router = express.Router();
const Vitals = require("../models/Vitals");
const authCheck = require("../middleware/authCheck");

/**
 * POST vitals (ESP32 / Postman)
 */
router.post("/", authCheck, async (req, res) => {
  try {
    console.log("📥 Incoming body:", req.body);

    const { heartRate, spo2, temperature } = req.body;

    // validation
    if (
      heartRate === undefined ||
      spo2 === undefined ||
      temperature === undefined
    ) {
      return res.status(400).json({ error: "Missing vitals data" });
    }

    const vitals = new Vitals({
      heartRate: Number(heartRate),
      spo2: Number(spo2),
      temperature: Number(temperature),
      status:
        temperature > 38 || heartRate > 120
          ? "CRITICAL"
          : temperature > 37
          ? "WARNING"
          : "NORMAL"
    });

    await vitals.save();

    console.log("✅ Vitals saved");

    res.json({ message: "Vitals saved" });
  } catch (err) {
    console.error("❌ Vitals save error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET vitals (Frontend)
 */
router.get("/", authCheck, async (req, res) => {
  try {
    const vitals = await Vitals.find()
      .sort({ createdAt: -1 })
      .limit(1);

    res.json(vitals);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

