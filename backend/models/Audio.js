const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
});

const AudioModel = mongoose.model('Audio', audioSchema);

module.exports = AudioModel;
