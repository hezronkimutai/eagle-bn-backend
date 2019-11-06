const EchoUtil = {
  echo(receiverId, data, connectedClients, io, type) {
    if (!receiverId) {
      io.emit(type, data);
    } else if (connectedClients[receiverId.toString()]) {
      connectedClients[receiverId.toString()].forEach(element => {
        io.to(element).emit(type, data);
      });
    }
  }
};

export default EchoUtil;
