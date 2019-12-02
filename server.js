const express = require('express')
const app = express()
const request = require('request')
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let key = "P3AQOb2xS2adhA2lOUe4kgRmuuGn0MMp"

app.use(express.static('public'))

app.get("/gifs/:gif", function(req, res){
    
})

io.on('connection', function(socket){
    socket.broadcast.emit('connection message')
    socket.on('chat message', function(msg){
        io.send(msg)
      });
    socket.on('disconnect', function(){
        socket.broadcast.emit('disconnect message')
    })
    socket.on('typing', function(){
        socket.broadcast.emit('typing')
    })
    socket.on('newuser', function (nick){
        var newUser = nick;
        console.log(newUser + ' connected');
    })
    socket.on('gif', function(topic){
        request(`http://api.giphy.com/v1/gifs/search?q=${topic}&api_key=${key}&limit=5`, function(err, response, body){
            if(err){
               console.log(err)
            }else {
                console.log("receive gif")
                socket.emit('recieve gif', body)
            }   
        })
    })

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

