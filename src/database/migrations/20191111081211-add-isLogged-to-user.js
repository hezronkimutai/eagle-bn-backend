'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users','isLogged',{
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },'')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users','isLogged');
  }
};
