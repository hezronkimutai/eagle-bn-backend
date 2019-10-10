/* eslint-disable require-jsdoc */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import '@babel/polyfill';

const helper = {
  createToken(userId, email, verified) {
    return jwt.sign(
      {
        userId,
        email,
        verified
      },
      process.env.PRIVATE_KEY,
      {
        expiresIn: '24h',
      },
    );
  },
  hashPassword(password) {
    if (password) {
      return bcrypt.hashSync(password, 10, (err, hash) => hash);
    }
    return undefined;
  },
  comparePassword(password, hash) { return bcrypt.compareSync(password, hash, (err, res) => res); },
  async decodeToken(token) {
    const data = await jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
      if (err) return { error: err.message };
      return decoded;
    });
    return data;
  }
};
export default helper;
