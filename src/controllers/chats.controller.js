import ChatService from '../services/chat.service';
import sendResult from '../utils/sendResult';

const sendChatEcho = (receiverId, data, connectedClients, io) => {
  if (!receiverId) {
    io.emit('new_message', data);
  } else if (connectedClients[receiverId.toString()]) {
    connectedClients[receiverId.toString()].forEach(element => {
      io.to(element).emit('new_message', data);
    });
  }
};

const ChatsController = {
  async postChat(req, res) {
    const { message, receiverId } = req.body;
    const { userId } = req.userData;
    const { io } = req;
    const chat = {
      authorId: userId,
      message,
      receiverId
    };
    const result = await ChatService.addChat(chat);
    sendChatEcho(receiverId, result, req.connectedClients, io);
    sendResult(res, 201, 'chat posted successfully', result);
  },

  async getChats(req, res) {
    const { userId } = req.userData;
    let { limit, offset } = req.query;

    if (!limit) limit = 10;
    if (!offset) offset = 0;
    const chatList = await ChatService.getChat(userId, offset, limit);

    sendResult(res, 200, 'chat list', chatList);
  }
};

export default ChatsController;
