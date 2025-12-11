import app from '@adonisjs/core/services/app'
import { Server } from 'socket.io'
import server from '@adonisjs/core/services/server'

app.ready(() => {
  const io = new Server(server.getNodeServer(), {
    cors: {
      origin: '*', // Esta configución se debe eliminar no olvidar solo permitir las fuentes de medihome ejemplo 'https://medihome.render.com'. o el dominio que compren...
    },
  })

  const users: any = {}

  io?.on('connection', (socket) => {

    socket.on('solicitudVisita', (data) => {
      io.emit('solicitudVisita', data)
    })

    socket.on('register', (userId) => {
      users[userId] = socket.id
    })

    socket.on('visitaMedico', ({ toUserId, data }) => {
      const target = users[String(toUserId)]
      if (target) {
        io.to(target).emit('visitaConfirmada', data)
      }
    })
    socket.on('registroPago', (data) => {
      io.emit('registroPago', data)
    })

    socket.on('disconnect', () => {
      for (const userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId]
          break
        }
      }
    })
  })
})
