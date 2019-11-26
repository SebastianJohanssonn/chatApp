var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

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
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});