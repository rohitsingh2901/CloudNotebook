const express = require('express');
const route = express.Router();
const EventModel = require('../models/Event')

route.post('/api/events', async (req, res) => {
    try {
      const { title, start, end } = req.body;
      const event = new EventModel({ title, start, end });
      const savedEvent = await event.save();
      res.status(201).json(savedEvent);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

route.get('/api/events', async (req, res) => {
    try {
      const events = await EventModel.find();
      res.status(200).json(events);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
module.exports = route