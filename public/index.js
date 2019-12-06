var socket = io()
const messageList = document.getElementById('messages')
const typing = document.getElementById('typing')
const messageInput = document.getElementById('message')
const commands = document.getElementById('commands')
const messageForm = document.getElementById('messageForm')
const userForm = document.getElementById('userForm')
const usernameInput = document.getElementById('username')
let username = $('#username')
//Shows message
socket.on('message', function(msg){
    let li = document.createElement('li')
    li.innerHTML = msg
    messageList.append(li)
    scrollBottom()
});
//Shows gif
socket.on('recieve gif', function(data, username){
    const li = document.createElement('li')
    const image = document.createElement('img')
    image.className = 'rounded mx-auto d-block mt-1'
    li.innerHTML = '<span style="font-size:13px;font-weight:700;text-decoration:underline;">' + username + ':</span><br>'
    image.src = JSON.parse(data).data[0].images.downsized.url
    li.append(image)
    messageList.append(li)
    scrollBottom()
})
//Shows if someone is typing
socket.on('typing', function(data){
    typing.innerHTML = '<p><em>' + data.user + ' is typing...</em></p>'
})
//Removes typing message
socket.on('not typing', function(){
    typing.innerHTML = ''   
})

function showCommands(){
    if(messageInput.value === '/'){
        commands.style.display = 'flex'
    }else {
        commands.style.display = 'none'
    }
}

function scrollBottom() {
    var log = $('#messageContainer')
    log.scrollTop(log.prop('scrollHeight'))
}

$('#userForm').on('submit', function(e){
    let string = username.val()
    let upperCaseUsername = string[0].toUpperCase() + string.slice(1)
    if(username.val() === ''){
        alert('You have to choose a username!')
    }else{
        socket.emit('set user', upperCaseUsername, function(data){
            $('#userFormWrap').hide()
            $('#mainWrap').show()
        });

    }
    e.preventDefault()
})

function initSite(){
    messageInput.addEventListener('keyup', function(e){
        if(e.keyCode === 13 || messageInput.value === ''){
            socket.emit('not typing')
        }else{
            socket.emit('typing')
        }
    })
    
    messageForm.addEventListener('submit', function(e){
        e.preventDefault();
        if(messageInput.value.indexOf('/') === 0){
            if(messageInput.value.indexOf('/gif') === 0){
                socket.emit("gif", messageInput.value.substring(5))
            }
        }else {
            if(messageInput.value){
                socket.emit('chat message', messageInput.value)
            }
        }
        messageInput.value = ''
        socket.emit("not typing")
    })
}