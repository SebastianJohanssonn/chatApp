var socket = io()
const messageList = document.getElementById('messages')
const typing = document.getElementById('typing')
const msgBtn = document.getElementById('msgBtn')
const messageInput = document.getElementById('m')


socket.on('message', function(msg){
    let li = document.createElement('li');
    li.innerHTML = msg
    messageList.append(li)
});
socket.on('disconnect message', function(){
    li.innerText = "User disconnected"
    messageList.appendChild(li)
});
socket.on('connection message', function(){
    li.innerText = "User connected"
    messageList.appendChild(li)
});
function initSite(){

    /* messageInput.addEventListener('keyup', function(e){
        if(e.keyCode === 13){
            socket.emit("not typing")
        }else{
            socket.emit('typing')
        }
    })
    socket.on('typing', function(){
        typing.innerHTML = '<p><em>User is typing...</em></p>';
        
    })
    socket.on('not typing', function(){
        setTimeout(() => {
            typing.innerHTML = ""  
        }, 5000)
    }) */
    
}

async function getGifs(){
    
    const gifDiv = document.getElementById("messages");
    const image = document.createElement("img")
    image.className= "row"

    
    await fetch(`http://localhost:3000/gifs/${messageInput.value}`)
        .then(res => res.json())
        .then(data =>{
            
                console.log(data.data[0].images)
                image.src = data.data[0].images.downsized.url
                gifDiv.appendChild(image)
            
        }).
        catch(error => {
            console.log(error)
        })
    
}


var nick = prompt('What is your desired username?');
$(function () {
    socket.emit('newuser', nick);
});

$(function () {
    $('form').submit(function(e){
        e.preventDefault();
        socket.emit('chat message' ,messageInput.value);
        messageInput.value = "";
        return false;
    });
});

