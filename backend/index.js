
const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
const path = require('path');
 

connectToMongo();

const app = express()
app.use(cors())
app.use(express.json())
const port = 5000

// app.get('/', (req, res) => {
//   res.send('Hello Rohit!')
// })
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.use('/',require('./routes/auth'))
app.use('/',require('./routes/notes'))
app.use('/',require('./routes/audio'))
app.use('/',require('./routes/location'))
app.use('/',require('./routes/cards'))
app.use('/',require('./routes/links'))
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));





// Not a good practice make routes using Router in express
// app.get('/singup', (req, res) => {
//   res.send('Hello Signup!')
// })
// app.get('/login', (req, res) => {
//   res.send('Hello Login!')
// })
