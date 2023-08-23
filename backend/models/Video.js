const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
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
  name:{
    type: String,
    required : true,
  },
  email:{
    type: String,
    required : true,
  },
  id:{
    type: String,
    required : true,
  },
  heading:{
    type: String,
    required : true,
  },

});

const VideoModel = mongoose.model('Video', videoSchema);

module.exports = VideoModel;
