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

route.post('/api/update-event', async (req, res) => {
    const {event,selectedEvent} = req.body;
    try{
      const updateEvent = await EventModel.findByIdAndUpdate(selectedEvent._id,{title:event.title});
      if (!updateEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }

      return res.status(200).json({ updateEvent });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  route.delete('/api/delete-event/:id',async(req,res)=>{
    const id = req.params.id;
    try {
      const deletedItem = await EventModel.findByIdAndDelete(id);
      if (!deletedItem) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json({ message: 'Event deleted successfully', deletedItem });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  })


  
module.exports = route