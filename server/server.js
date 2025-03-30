const express = require('express')
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config()


const bodyParser = require('body-parser')
const cors = require('cors')


const userRoutes = require('./routes/userRoute')
const documentRoutes = require('./routes/documentsRoute')
const groupRoutes = require('./routes/groupsRoute');
const projectRoutes = require('./routes/projectsRoute');
const templateRoutes = require('./routes/templateRoute');

const mongoose = require('mongoose')

const Project = require('./models/projectModel');


const app = express()
const port = 3000
app.use(bodyParser.json())

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use('/api/user', userRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/template', templateRoutes)

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  }
});




io.on('connection', (socket) => {

  socket.on('get-document', async projectId => {
    const project = await Project.findById(projectId)
    // console.log(project.content)
    socket.join(projectId)
    socket.emit('load-document', project.content);

    socket.on('send-changes', delta =>{
      // console.log(delta)
      socket.broadcast.to(projectId).emit("receive-changes", delta)
    })

    //save the document
    socket.on('save-document', async data =>{
      // console.log(data)
      await Project.findByIdAndUpdate(projectId , {content : {data}})
    })
  })

});



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    server.listen(port, () => {
      console.log('connected to db & listening on port', port)
    })
  })
  .catch((error) => {
    console.log(error)
  })
