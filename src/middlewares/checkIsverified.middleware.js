import db from '../database/models';
import sendResult from '../utils/sendResult';

const isUserVerified = async (req, res, next) => {
  const User = await db.Users.findOne({
    where: { email: req.body.email },
    include: [{ model: db.Roles, attributes: { include: ['roleName'] }, raw: true }]
  });

  if (!User.isverified) {
    return sendResult(res, 400, 'The user is not verified');
  }
  req.old_role = User.Role.roleName;
  next();
};

export default isUserVerified;
