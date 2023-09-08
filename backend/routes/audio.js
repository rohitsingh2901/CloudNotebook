const express = require('express');
const route = express.Router();
const path = require('path');
const fs = require('fs');

// const { body , validationResult } = require('express-validator');
// const fetchUser = require('../Middleware/fetchUser')
const AudioModel = require('../models/Audio')
const VideoModel = require('../models/Video')
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
const storage2 = multer.diskStorage({ 
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Specify the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, 'videoFile-' + Date.now() + '-' + Math.random() + '.webm'); // Generate a unique file name for the uploaded audio file
  },
});
const upload2 = multer({ storage: storage2 });


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
  route.post('/upload-video', upload2.single('videoFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No video file received.' });
      }
  
      const { filename, originalname, mimetype } = req.file;
      const {name,email,id,heading} = req.body;
      // Create a new instance of the videoModel
      const newVideo = new VideoModel({
        fileName: filename,
        originalName: originalname,
        mimeType: mimetype,
        name: name,
        email: email,
        id: id,
        heading:heading,
      });
  
      // Save the audio metadata to MongoDB
      await newVideo.save();
  
      res.status(200).json({ message: 'Audio saved successfully.',filename:filename });
    } catch (error) {
      console.error('Error saving video:', error);
      res.status(500).json({ error: 'Failed to save video.' });
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

  route.post('/getvideos', async (req, res) => {
    try {
      const id = req.body.id; 
      const users = await VideoModel.find(id);
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
  route.delete('/deletevideo/:fileName', async (req, res) => {
    try {
      const { fileName } = req.params;
  
      // Find the audio record in the database
      const audio = await VideoModel.findOne({ fileName: fileName });
  
      if (!audio) {
        return res.status(404).json({ error: 'Video not found.' });
      }
  
      // Remove the audio record from the database
      await audio.deleteOne();
  
      // Delete the audio file from the server's storage
      const filePath = path.join(__dirname, '../../', 'uploads', fileName);
      fs.unlinkSync(filePath);
  
      res.status(200).json({ message: 'Video deleted successfully.' });
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).json({ error: 'Failed to delete video.' });
    }
  });

  module.exports = route;