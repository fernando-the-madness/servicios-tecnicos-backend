module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
    });

    socket.on('aceptar-solicitud', (data) => {
      io.to(data.clientId).emit('solicitud-aceptada', data);
    });

    socket.on('enviar-mensaje', (data) => {
      io.to(data.to).emit('nuevo-mensaje', data);
    });

    socket.on('disconnect', () => {
      console.log('Usuario desconectado:', socket.id);
    });
  });
};