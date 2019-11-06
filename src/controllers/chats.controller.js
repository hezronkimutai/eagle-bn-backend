import ChatService from '../services/chat.service';
import sendResult from '../utils/sendResult';
import EchoUtil from '../utils/echo.util';

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
    EchoUtil.echo(receiverId, result, req.connectedClients, io, 'new_message');
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
