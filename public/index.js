var socket = io()
const messageList = document.getElementById('messages')
const typing = document.getElementById('typing')
const messageInput = document.getElementById('message')
const commands = document.getElementById("commands")
const messageForm = document.getElementById("messageForm")
const userForm = document.getElementById('userForm');
const usernameInput = document.getElementById('username')
let username = $('#username')
//Shows message
socket.on('message', function(msg){
    let li = document.createElement('li');
    li.innerHTML = msg
    messageList.append(li)
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

$('#userForm').on("submit", function(e){
    socket.emit('set user', username.val(), function(data){
        $('#userFormWrap').hide();
        $('#mainWrap').show();
    });
    e.preventDefault();
});  

function initSite(){
    socket.on('typing', function(data){
        typing.innerHTML = '<p><em>' + data.user + ' is typing...</em></p>';  
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
            if(messageInput.value.indexOf("/gif") === 0){
                socket.emit("gif", messageInput.value.substring(5))
            }
            if(messageInput.value.indexOf("/leave") === 0){
                          
            }
        }else {
            socket.emit('chat message', messageInput.value);
        }
        messageInput.value = "";
        socket.emit("not typing")
    })
}




