import helpers from '../../utils/helper';
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkInsert('Roles', [
      {
      roleName: 'System Administrator',
      roleValue: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      roleName: 'Travel Administrator',
      roleValue: 'Tadmin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      roleName: 'Travel Team Member',
      roleValue: 'member',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      roleName: 'manager',
      roleValue: 'manager',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      roleName: 'requester',
      roleValue: 'requester',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      roleName: 'host',
      roleValue: 'host',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  ]),
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkDelete('Roles', null, {})
  ])
};
