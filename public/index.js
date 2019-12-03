var socket = io()
const messageList = document.getElementById('messages')
const typing = document.getElementById('typing')
const messageInput = document.getElementById('message')
const commands = document.getElementById("commands")
const messageForm = document.getElementById("messageForm")

//Shows message
socket.on('message', function(msg){
    let li = document.createElement('li');
    li.innerHTML = msg
    messageList.append(li)
    socket.emit('newuser', nick);
});
//Shows if user disconnected
socket.on('disconnect message', function(){
    let li = document.createElement('li');
    li.innerText = "User disconnected"
    messageList.appendChild(li)
});
//Shows if user connected
socket.on('connection message', function(){
    let li = document.createElement('li');
    li.innerText = "User connected"
    messageList.appendChild(li)
});
//Show gif
socket.on("recieve gif", function(data){
    const gifDiv = document.getElementById("messages");
    const image = document.createElement("img")
    image.className= "row"
    image.src = JSON.parse(data).data[0].images.downsized.url
    gifDiv.appendChild(image)
})

function showCommands(){
    if(messageInput.value === "/"){
        commands.style.display = "flex"
    }else {
        commands.style.display = "none"
    }
}
function initSite(){
    socket.on('typing', function(){
        typing.innerHTML = '<p><em>User is typing...</em></p>';  
    })
    socket.on('not typing', function(){
        typing.innerHTML = ""   
    })

    messageInput.addEventListener('keyup', function(e){
        if(e.keyCode === 13 || messageInput.value === ""){
            socket.emit("not typing")
        }else{
            socket.emit('typing')
        }
    })
    
    messageForm.addEventListener("submit", function(e){
        e.preventDefault();
        if(messageInput.value.indexOf("/") === 0){
            socket.emit("gif", messageInput.value.substring(1))
        }else {
            socket.emit('chat message', messageInput.value);
        }
        messageInput.value = "";
        return false;
    })
    
}

var nick = prompt('What is your desired username?');
$(function () {
    socket.emit('newuser', nick);
});
    


