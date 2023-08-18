const express = require('express');
const route = express.Router();
const path = require('path');
const fs = require('fs');

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
      const {name,email,id,heading} = req.body;
      // Create a new instance of the AudioModel
      const newAudio = new AudioModel({
        fileName: filename,
        originalName: originalname,
        mimeType: mimetype,
        name: name,
        email: email,
        id: id,
        heading:heading,
      });
  
      // Save the audio metadata to MongoDB
      await newAudio.save();
  
      res.status(200).json({ message: 'Audio saved successfully.',filename:filename });
    } catch (error) {
      console.error('Error saving audio:', error);
      res.status(500).json({ error: 'Failed to save audio.' });
    }
  });
  
  route.post('/getaudio', async (req, res) => {
    try {
      const id = req.body.id; 
      const users = await AudioModel.find(id);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  route.delete('/deleteaudio/:filename', async (req, res) => {
    try {
      const { filename } = req.params;
  
      // Find the audio record in the database
      const audio = await AudioModel.findOne({ fileName: filename });
  
      if (!audio) {
        return res.status(404).json({ error: 'Audio not found.' });
      }
  
      // Remove the audio record from the database
      await audio.deleteOne();
  
      // Delete the audio file from the server's storage
      const filePath = path.join(__dirname, '../../', 'uploads', filename);
      fs.unlinkSync(filePath);
  
      res.status(200).json({ message: 'Audio deleted successfully.' });
    } catch (error) {
      console.error('Error deleting audio:', error);
      res.status(500).json({ error: 'Failed to delete audio.' });
    }
  });

  module.exports = route;