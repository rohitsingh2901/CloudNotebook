const express = require('express');
const route = express.Router();



const Links = require('../models/Links')

route.post('/get-links', async (req, res) => {
    try {
      const { url,imgurl,title } = req.body;
      const link = new Links({ url,imgurl,title });
      await link.save();
      res.status(201).json(link);
    } catch (error) {
      res.status(500).json({ error: 'Could not create link' });
    }
  });
  
 
  route.get('/get-links', async (req, res) => {
    try {
      const links = await Links.find();
      res.status(200).json(links);
    } catch (error) {
      res.status(500).json({ error: 'Could not retrieve links' });
    }
  });

  route.delete('/get-links/:index', async (req, res) => {
    const {index} = req.params;
    try {
      const link = await Links.findByIdAndDelete(index);
      res.status(200).json(link);
    } catch (error) {
      res.status(500).json({ error: 'Could not delete link' });
    }
  });


 module.exports = route;