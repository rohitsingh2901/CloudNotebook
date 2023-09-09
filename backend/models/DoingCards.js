const mongoose = require('mongoose')
const { Schema } = mongoose;

const Cards = new mongoose.Schema({
    title: String,
    description: String,
    column: String,
  });

module.exports = mongoose.model('DoingCards',Cards)