import db from '../database/models';

const UserService = {
  getUser: async (condition) => db.Users.findOne({ where: condition, raw: true }),
  manageUserSubscription: async (id, receiveEmails) => db.Users.update(
    { receiveEmails },
    { where: { id } },
  ),

  async updateUser(data, condition) {
    const user = await db.Users.update(data, {
      where: condition, returning: true, plain: true, raw: true,
    });
    return user[1];
  },

  async getOneUser(condition) {
    const user = await db.Users.findOne({ where: condition, raw: true });
    return user;
  }

};

export default UserService;
