const express = require('express')
const app = express()
const request = require('request')
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let key = "P3AQOb2xS2adhA2lOUe4kgRmuuGn0MMp"
var users = [];
var rooms = []

app.use(express.static('public'))

io.on('connection', function(socket){
    socket.broadcast.emit("connection message")

    socket.on('chat message', function(msg){
        io.sockets.to(socket.room).emit("chat message", '<span style="font-size:10px;font-weight:700;text-decoration:underline;">' + socket.username + '</span>' + '<br>' + msg)
    });
    socket.on('disconnect', function(data){
        socket.broadcast.emit('disconnect message', {
            msg: data,
            user: socket.username
        })
    })
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', {
            msg: data,
            user: socket.username
        });
    })
    socket.on('not typing', function(){
        socket.broadcast.emit('not typing')
    })
 
    socket.on('set user' , (data, callback) =>{
        if(data === ''){
            callback(false);
        }else{
            callback(true);
            socket.username = data;
            users.push(socket.username);
            updateUsers();
        }
    })

    socket.on('create', function(room, password) {
        socket.room = room
        rooms.push({
            room: socket.room,
            password: password
        })
        io.emit("create", rooms)
    });
    
    socket.on("join", function(room, password){
        for(var i; i < rooms.length; i++){
            if(rooms[i].room === room && rooms[i].password === password){
                socket.join(room)
            }
        }
        console.log(socket.room)
    })

    function updateUsers(){
       io.sockets.emit('users', users); 
    }
   
    socket.on('gif', function(topic){
        request(`http://api.giphy.com/v1/gifs/search?q=${topic}&api_key=${key}&limit=5`, function(err, response, body){
            if(err){
               console.log(err)
            }else {
                io.emit('recieve gif', body)
            }   
        })
    })

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

