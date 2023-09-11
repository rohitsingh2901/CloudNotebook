const mongoose = require('mongoose');

const LinksSchema = new mongoose.Schema({
    url: String,
    imgurl: String,
    title: String,
  });
  
const Links = mongoose.model('Links', LinksSchema);

module.exports = Links;