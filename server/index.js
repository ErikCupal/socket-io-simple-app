const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const log = console.log

const app = express()
const port = 8082
const server = http.createServer(app)
const io = socketIo(server)

server.listen(port, () => log(`🍹 Http server with Express and Socket.IO is listening on port ${port}`))

// Configure basic routes

app.get('/', (req, res) => {
  res.send(
    `
    <h1>Hello World!</h1>
    <br/>
    <a href="/chat">Chat</a>
    `
  )
})

app.get('/chat', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

app.get('/app.js', (req, res) => {
  res.sendFile(process.cwd() + '/client/app.js')
})

let clientNames = []

io.on('connect', socket => {

  log(`🍔 New socket with id ${socket.id}`)

  socket.on('REGISTER', name => {
    const possiblyExistingName = clientNames.find(clientName => clientName === name)

    if (possiblyExistingName) {
      socket.emit('NAME_TAKEN')
    } else {
      clientNames.push(name)
      socket.emit('REGISTERED')

      socket.on('CHAT_MESSAGE', message => {
        socket.broadcast.emit('CHAT_MESSAGE', message)
      })
    }

  })

})