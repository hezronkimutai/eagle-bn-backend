/* eslint-disable require-jsdoc */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
  comparePassword(password, hash) { return bcrypt.compareSync(password, hash, (err, res) => res); }
};
export default helper;
