const express = require('express')
const app = express()
const request = require('request')
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let key = "P3AQOb2xS2adhA2lOUe4kgRmuuGn0MMp"
var users = [];

app.use(express.static('public'))

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.send('<span style="font-size:13px;font-weight:700;text-decoration:underline;">' + socket.username + '</span>' + '<br>' + msg)
    });
    socket.on('disconnect', function(data){
        socket.broadcast.emit("not typing")
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

    function updateUsers(){
       io.sockets.emit('users', users); 
    }
   
    socket.on('gif', function(topic){
        request(`http://api.giphy.com/v1/gifs/search?q=${topic}&api_key=${key}&limit=5`, function(err, response, body){
            if(err){
               console.log(err)
            }else {
                io.emit('recieve gif', body, socket.username)
            }   
        })
    })

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

