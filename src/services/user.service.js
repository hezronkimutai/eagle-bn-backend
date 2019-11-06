import db from '../database/models/index';
import helpers from '../utils/helper';

const UserService = {
  async getUser(condition) {
    return db.Users.findOne({ where: condition, raw: true });
  },

  async manageUserSubscription(id, receiveEmails) {
    return db.Users.update({ receiveEmails }, { where: { id } });
  },

  async getUserByEmail(email) {
    const newUser = await db.Users.findOne({
      where: { email },
      include: [{ model: db.Roles, attributes: { include: 'roleValue' } }],
    });
    return newUser;
  },

  async updateUserByEmail(updateObj, email) {
    const newUser = await db.Users.update(updateObj, {
      where: { email }, returning: true, raw: true
    });
    return newUser[1][0];
  },

  async updateUserById(id, object) {
    const newUser = await db.Users.update(object, { where: { id } });
    return newUser;
  },

  async findOrCreateUser(userData, email) {
    const [data] = await db.Users.findOrCreate({
      where: { email },
      defaults: userData.user
    });
    return data;
  },

  async createUser(fullname, password, email) {
    const response = await db.Users.create({
      email,
      password: helpers.hashPassword(password),
      fullname
    });
    return response;
  }

};

export default UserService;
