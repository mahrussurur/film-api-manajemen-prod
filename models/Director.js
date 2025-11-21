const mongoose = require('mongoose');

const directorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    birthYear: { type: Number, required: true },
  },
  { timestamps: true }
);

const director = mongoose.model('director', directorSchema);

module.exports = director;