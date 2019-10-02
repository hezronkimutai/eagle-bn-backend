'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    example: DataTypes.STRING
  }, { freezeTableName: true });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
