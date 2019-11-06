'use strict';
module.exports = (Sequelize, DataTypes) => {
  const Notifications = Sequelize.define('Notifications', {
    modelId: { type: DataTypes.INTEGER, allowNull: false },
    modelName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['Requests', 'Accommodations', 'Comments']],
          msg: 'That table doesn\'t exist',
        },
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['new_request', 'request_approved', 'request_rejected', 'new_comment']],
          msg: 'Invalid value',
        },
      },
    },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, { freezeTableName: true });
  Notifications.associate = function(models) {
    Notifications.belongsTo(models.Users, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
  };
  return Notifications;
};
