'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users','RoleId',{
      type: 'integer',
      allowNull: true,
      defaultValue: 5,
      references: {
        model: 'Roles',
        key: 'id',
        onDelete: 'SET NULL'
      }
    },'')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users','RoleId');
  }
};
