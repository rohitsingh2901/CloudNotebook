const mongoose = require('mongoose');

const URI = 'mongodb://127.0.0.1:27017/cloudnotebook';

const connectToMongo = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Connected Successfully!!!');
  } catch (error) {
    console.error('Connection Error:', error);
  }
};

module.exports = connectToMongo;
