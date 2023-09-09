const express = require('express');
const TODOCards = require('../models/TODOCards');
const DoneCards = require('../models/DoneCards');
const DoingCards = require('../models/DoingCards');
const route = express.Router();




route.post('/create-todocard', async (req, res) => {
    try {
      const { title, description, column } = req.body;
      const newCard = new TODOCards({ title, description ,column });
      await newCard.save();
      res.status(201).json(newCard);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  route.post('/create-doingcard', async (req, res) => {
    try {
      const { title, description, column } = req.body;
      const newCard = new DoingCards({ title, description ,column });
      await newCard.save();
      res.status(201).json(newCard);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  route.post('/create-donecard', async (req, res) => {
    try {
      const { title, description, column } = req.body;
      const newCard = new DoneCards({ title, description ,column });
      await newCard.save();
      res.status(201).json(newCard);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });


  //Fetch cards
  route.get('/todo-cards', async (req, res) => {
    try {
      const todoCards = await TODOCards.find();
      res.status(200).json(todoCards);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  route.get('/doing-cards', async (req, res) => {
    try {
      const todoCards = await DoingCards.find();
      res.status(200).json(todoCards);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  route.get('/done-cards', async (req, res) => {
    try {
      const todoCards = await DoneCards.find();
      res.status(200).json(todoCards);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  

  //Delete cards
  route.delete('/todo-cards/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const cardToDelete = await TODOCards.findById(id);
  
      if (!cardToDelete) {
        return res.status(404).json({ error: 'Card not found' });
      }
  
      if (cardToDelete.column !== 'todo') {
        return res.status(403).json({ error: 'Card is not in the "todo" column' });
      }
  
      const deletedCard = await TODOCards.findByIdAndDelete(id);
  
      res.status(200).json(deletedCard);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  route.delete('/doing-cards/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const cardToDelete = await DoingCards.findById(id);
  
      if (!cardToDelete) {
        return res.status(404).json({ error: 'Card not found' });
      }
  
      if (cardToDelete.column !== 'doing') {
        return res.status(403).json({ error: 'Card is not in the "doing" column' });
      }
  
      const deletedCard = await DoingCards.findByIdAndDelete(id);
  
      res.status(200).json(deletedCard);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  route.delete('/done-cards/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const cardToDelete = await DoneCards.findById(id);
  
      if (!cardToDelete) {
        return res.status(404).json({ error: 'Card not found' });
      }
  
      if (cardToDelete.column !== 'done') {
        return res.status(403).json({ error: 'Card is not in the "done" column' });
      }
  
      const deletedCard = await DoneCards.findByIdAndDelete(id);
  
      res.status(200).json(deletedCard);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  //Edit cards
  route.put('/todocards/edit/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
  
      const updatedCard = await TODOCards.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      );
  
      if (!updatedCard) {
        return res.status(404).json({ error: 'Card not found' });
      }
  
      res.status(200).json(updatedCard);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  route.put('/doingcards/edit/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
  
      const updatedCard = await DoingCards.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      );
  
      if (!updatedCard) {
        return res.status(404).json({ error: 'Card not found' });
      }
  
      res.status(200).json(updatedCard);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  route.put('/donecards/edit/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
  
      const updatedCard = await DoneCards.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      );
  
      if (!updatedCard) {
        return res.status(404).json({ error: 'Card not found' });
      }
  
      res.status(200).json(updatedCard);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });


  //Move 

  route.put('/move-to-doing/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the card in TODOCards collection
      const cardToMove = await TODOCards.findById(id);
  
      if (!cardToMove) {
        return res.status(404).json({ error: 'Card not found' });
      }
  
      // Create a new card in DoingCards collection
      const newDoingCard = new DoingCards({
        title: cardToMove.title,
        description: cardToMove.description,
        column: 'doing',
      });
  
      await newDoingCard.save();
  
      // Delete the card from TODOCards collection
      await TODOCards.findByIdAndDelete(id);
  
      res.status(200).json(newDoingCard);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  route.put('/move-to-todo/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the card in TODOCards collection
      const cardToMove = await DoingCards.findById(id);
  
      if (!cardToMove) {
        return res.status(404).json({ error: 'Card not found' });
      }
  
      // Create a new card in TODO collection
      const newDoingCard = new TODOCards({
        title: cardToMove.title,
        description: cardToMove.description,
        column: 'todo',
      });
  
      await newDoingCard.save();
  
      // Delete the card from TODOCards collection
      await DoingCards.findByIdAndDelete(id);
  
      res.status(200).json(newDoingCard);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  route.put('/move-to-doing-from-done/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the card in TODOCards collection
      const cardToMove = await DoneCards.findById(id);
      if (!cardToMove) {
        return res.status(404).json({ error: 'Card not found' });
      }
  
      // Create a new card in TODO collection
      const newDoingCard = new DoingCards({
        title: cardToMove.title,
        description: cardToMove.description,
        column: 'doing',
      });
  
      await newDoingCard.save();
  
      // Delete the card from TODOCards collection
      await DoneCards.findByIdAndDelete(id);
  
      res.status(200).json(newDoingCard);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  route.put('/move-to-done/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the card in TODOCards collection
      const cardToMove = await DoingCards.findById(id);
      if (!cardToMove) {
        return res.status(404).json({ error: 'Card not found' });
      }
  
      // Create a new card in TODO collection
      const newDoingCard = new DoneCards({
        title: cardToMove.title,
        description: cardToMove.description,
        column: 'done',
      });
  
      await newDoingCard.save();
  
      // Delete the card from TODOCards collection
      await DoingCards.findByIdAndDelete(id);
  
      res.status(200).json(newDoingCard);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  module.exports = route;