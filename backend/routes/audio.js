const express = require('express');
const route = express.Router();
// const { body , validationResult } = require('express-validator');
// const fetchUser = require('../Middleware/fetchUser')
const AudioModel = require('../models/Audio')
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Specify the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, 'audioFile-' + Date.now() + '-' + Math.random() + '.webm'); // Generate a unique file name for the uploaded audio file
  },
});
const upload = multer({ storage: storage });


  route.post('/upload-audio', upload.single('audioFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No audio file received.' });
      }
  
      const { filename, originalname, mimetype } = req.file;
  
      // Create a new instance of the AudioModel
      const newAudio = new AudioModel({
        fileName: filename,
        originalName: originalname,
        mimeType: mimetype,
      });
  
      // Save the audio metadata to MongoDB
      await newAudio.save();
  
      res.status(200).json({ message: 'Audio saved successfully.' });
    } catch (error) {
      console.error('Error saving audio:', error);
      res.status(500).json({ error: 'Failed to save audio.' });
    }
  });
  
  module.exports = route;