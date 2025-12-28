import { Server } from 'socket.io'

export const initChat = (io) => {
  io.on('connection', (socket) => {
    console.log('Usuario conectado al chat:', socket.id)

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId)
      console.log(`Usuario ${socket.id} se unió a la sala ${roomId}`)
    })

    socket.on('sendMessage', ({ roomId, msg }) => {
      io.to(roomId).emit('message', msg)
    })

    // ✅ Nuevo evento: notificar al cliente cuando el técnico acepte
    socket.on('tecnicoAcepto', ({ roomId, tecnicoName }) => {
      io.to(roomId).emit('notificacionAceptado', {
        msg: `El técnico ${tecnicoName} ha aceptado tu solicitud y está en camino.`,
        status: 'en camino'
      })
    })

    socket.on('disconnect', () => {
      console.log('Usuario desconectado del chat:', socket.id)
    })
  })
}