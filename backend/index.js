
const connectToMongo = require('./db');
const express = require('express')

connectToMongo();



const app = express()
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






// Not a good practice make routes using Router in express
// app.get('/singup', (req, res) => {
//   res.send('Hello Signup!')
// })
// app.get('/login', (req, res) => {
//   res.send('Hello Login!')
// })
