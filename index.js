const express = require('express')
const connectDB = require('./db/index')
var bodyParser = require('body-parser')

const cors = require('cors')

const userrouter = require('./routes/userRoute.js');
const chatRoute=require('./routes/chatRoute.js')
const messageRoute=require('./routes/messageRoute.js')

const dotenv = require('dotenv');
dotenv.config();

connectDB();



const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.use(userrouter);
app.use(chatRoute);
app.use(messageRoute);

// parse application/json

app.use(express.json());


app.get('/', (req, res) => {
  res.send("you app is up and running")
})


const server=app.listen(process.env.PORT || 8000, () => {
  console.log("app is running on 8000");
});

const io=require("socket.io")(server,{
  pingTimeOut:6000,
  cors:{
    origin:"https://chat-ty.vercel.app/",
  },
});

io.on("connection",(socket)=>{
  console.log("connected socket");

  socket.on('setup',(userData)=>{
     socket.join(userData?._id);
     console.log('connected user',userData?._id);
     socket.emit('connected');
  })

socket.on('join chat',(room)=>{
  socket.join(room);
  console.log('User Joined room :'+ room)
})

socket.on('typing',(room)=>socket.in(room).emit("typing") )
socket.on('stop typing',(room)=>socket.in(room).emit("stop typing") )

socket.on('new message',(newMessageReceived)=>{
  // console.log(newMessageReceived)
  var chat = newMessageReceived.chat;

  // if(!chat.users) return console.log("chat.users not defined");

  chat.users.forEach(user=>{
     if(user._id==newMessageReceived.sender._id) return;

     socket.in(user._id).emit("message received",newMessageReceived);
  })

})

})