const socket = io('http://localhost:8082')

let name = undefined

const nameInput = document.getElementById('name-input')
const registerButton = document.getElementById('register-button')

const messageInput = document.getElementById('message-input')
const sendButton = document.getElementById('send-button')

const chat = document.getElementById('chat')

socket.on('connect', () => {

  registerButton.addEventListener('click', () => {
    name = nameInput.value
    socket.emit('REGISTER', name)
  })

  socket.on('NAME_TAKEN', () => alert('🐵 Name taken'))
  socket.on('REGISTERED', () => {
    alert('🎉 Registered')

    sendButton.addEventListener('click', () => {
      const message = {
        name: name,
        content: messageInput.value
      }

      socket.emit('CHAT_MESSAGE', message)
      chat.innerHTML += `<li>🐵 You: ${messageInput.value}</li>`

    })
  })


  socket.on('CHAT_MESSAGE', message => {
    const name = message.name
    const content = message.content

    chat.innerHTML += `<li>💌 ${name}: ${content}</li>`
  })
})