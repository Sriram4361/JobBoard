const express = require('express')
const bodyParser = require('body-parser')
const app = express()
var cors = require('cors');

const corsOptions = {
    origin: ['http://localhost:3000','http://192.168.0.184:3000'], // Replace with your React app's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };


app.use(cors(corsOptions))


const port = 8000
const db = require('./queries')

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

// app.get('/users', db.getUsers)
app.get('/jobs', db.getJobs)
app.post('/createUser', db.createUser)
app.post('/login', db.login)
app.post('/status', db.setJobStatus)
// app.put('/users/:id', db.updateUser)
// app.delete('/users/:id', db.deleteUser)