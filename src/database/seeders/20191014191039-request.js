'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkInsert('Requests', [{ // two-way trip
      UserId: 2,
      address: 'kigali',
      returnTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
  { // one-way trip
    UserId: 2,
    address: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }])
  ]),
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkDelete('Requests', null, {})
  ])
};
