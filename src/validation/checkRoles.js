import validator from '../utils/validator';
import sendResult from '../utils/sendResult';
import db from '../database/models/index';

const checkRole = async (req, res, next) => {
  try {
    new validator({ email: req }).req().email();
    new validator({ new_role: req }).req().min(2).alpha();
  } catch (error) {
    return sendResult(res, 400, error.message);
  }

  const checkIfExist = await db.Roles.findOne({ where: { roleValue: req.body.new_role } });

  if (!checkIfExist) return sendResult(res, 400, 'Role Value does not exist');

  req.new_role_id = checkIfExist.id;

  return next();
};

export default checkRole;
