var socket = io()
const messageList = document.getElementById('messages')
const typing = document.getElementById('typing')
const messageInput = document.getElementById('message')
const commands = document.getElementById("commands")
const messageForm = document.getElementById("messageForm")
const userForm = document.getElementById('userForm');
const usernameInput = document.getElementById('username')
const createRoom = document.getElementById("roomName")
const roomList = document.getElementById("rooms")
const setPassword = document.getElementById("newPassword")
const password = document.getElementById("password")
let username = $('#username')
let roomName;
//Shows message
socket.on('chat message', function(msg){
    let li = document.createElement('li');
    li.innerHTML = msg
    messageList.append(li)
    console.log("hej")
});
//Shows if user disconnected
socket.on('disconnect message', function(data){
    let li = document.createElement('li');
    li.innerText = data.user + " disconnected"
    messageList.appendChild(li)
});

//Shows if user connected
socket.on('connection message', function(data){
    let li = document.createElement('li');
    li.innerText = data.user + " connected"
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
function newRoom(){
    socket.emit('create', createRoom.value, setPassword.value);
}

function enterRoom(){
    socket.emit("join", roomName, password.value)
}

function clickedRoom(event){
    roomName = event.target.className
    password.className = roomName
}

$('#userForm').on("submit", function(e){
    socket.emit('set user', username.val(), function(data){
        $('#userFormWrap').hide();
        $('#mainWrap').show();
    });
    newRoom();
    socket.emit("connection message")
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
    socket.on("create", function(rooms){
        const room = document.createElement("li")
        room.innerHTML = rooms[0].room
        room.setAttribute("onclick", "clickedRoom(event)")
        room.className = rooms[0].room
        roomList.appendChild(room)
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
            socket.emit("chat message", messageInput.value)
        }
        messageInput.value = "";
        socket.emit("not typing")
    })
}





