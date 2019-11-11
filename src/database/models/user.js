'use strict';
/**
 * @swagger
 *
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - email
 *       - password
 *       - username
 *     properties:
 *       username:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *       createdAt:
 *         type: string
 *       updatedAt: 
 *         type: string
 *       token:
 *         type: string
 */
/**
 * @swagger
 *
 * definitions:
 *   login:
 *     type: object
 *     required:
 *       - userid
 *       - username
 *       - email
 *     properties:
 *       userid:
 *         type: string
 *       username:
 *         type: string
 *       email:
 *         type: string
 *       token:
 *         type: string
 */


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fullname:DataTypes.STRING,
    isverified: DataTypes.BOOLEAN,
    phone: DataTypes.STRING,
    gender: DataTypes.STRING,
    dob: DataTypes.DATE,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    avatar: DataTypes.STRING,
    department: DataTypes.STRING,
    lineManager: DataTypes.INTEGER,
    RoleId: DataTypes.INTEGER,
    rememberMe: DataTypes.BOOLEAN,
    isLogged: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    recieveEmails: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, { freezeTableName: true });
  User.associate = function(models) {
    User.belongsTo(models.Roles, {
        foreignKey: {
          allowNull: true,
        },
        onDelete: 'SET NULL',
    });
    User.hasMany(models.Notifications, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
  };
  return User;
};
