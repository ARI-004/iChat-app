const socket = io('https://ichat-app-n8ys.onrender.com')

const form = document.getElementById('input-container')
const messageInput = document.getElementById('message-input')
const messageContainer = document.querySelector('.container')
const btn = document.getElementById('send-button')
var audio = new Audio('ting.mp3')

const append = (message, position) => {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageElement.classList.add('messages')
    messageElement.classList.add(position)
    messageContainer.append(messageElement)
    if (position == 'left') {
        audio.play()
    }
}

function sendMessage() {
    const message = messageInput.value.trim();

    if (message === '') return;

    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
}

btn.addEventListener('click', sendMessage);

form.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});
const name = prompt("Enter your name to join")
socket.emit('new-user-joined', name);

socket.on('user-joined', name => {
    const msgElement = document.createElement('div')
    msgElement.innerText = `${name} joined the chat`
    msgElement.classList.add('join')
    msgElement.classList.add('middle')
    messageContainer.append(msgElement)
})

socket.on('receive', data => {
    append(`${data.name}:${data.message}`, 'left')
})

socket.on('left', name => {
    const msgEle = document.createElement('div')
    msgEle.innerText = `${name} left the chat`
    msgEle.classList.add('join')
    msgEle.classList.add('middle')
    messageContainer.append(msgEle)
})
