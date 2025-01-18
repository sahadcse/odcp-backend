const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate settings
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed, // Flexible to store string, number, or JSON
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: null, // Optional: Explain the purpose of this setting
    },
  },
  { timestamps: true } // Automatically handles createdAt and updatedAt);
);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
