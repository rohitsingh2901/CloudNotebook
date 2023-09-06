const express = require('express');
const route = express.Router();



const Location = require('../models/Location')

route.post('/locations', async (req, res) => {
    try {
      const { name, description, latitude, longitude } = req.body;
      const location = new Location({ name, description, latitude, longitude });
      await location.save();
      res.status(201).json(location);
    } catch (error) {
      res.status(500).json({ error: 'Could not create location' });
    }
  });
  
 
  route.get('/locations', async (req, res) => {
    try {
      const locations = await Location.find();
      res.status(200).json(locations);
    } catch (error) {
      res.status(500).json({ error: 'Could not retrieve locations' });
    }
  });


 module.exports = route;