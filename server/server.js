const express = require("express");
const cors = require("cors");
const connectDB = require("./config/app.config");
const dotenv = require("dotenv");
const userRoutes = require("./Routes/user.routes");
const chatRoutes = require("./Routes/chats.routes");
const messageRoutes = require("./Routes/messages.routes");

const { notFound, errorHandler } = require("./middleWare/error.middleWare");


dotenv.config();
connectDB();
const app = express();
app.use(cors(),express.json(),express.urlencoded({extended:true}));


app.use("/api/user", userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes)


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(
    PORT,
    console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server,{
    pingTimeout : 60000,
    cors:{
        origin : "http://localhost:3000"
    }
});

io.on("connection",(socket)=>{
    console.log(`connected to socket.io`);

    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        socket.emit("connected");
    })
    socket.on("joinChat",(room)=>{
        socket.join(room);
        console.log("user joined room:"+room);
        
    })
    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("notyping",(room)=>socket.in(room).emit("notyping"));
    socket.on("sendMessage",(newMessage)=>{
        var chat = newMessage.chat;

        if (!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user => {
            if(user._id == newMessage.sender._id) return;

            socket.in(user._id).emit("message Received",newMessage);
        })
    })
})