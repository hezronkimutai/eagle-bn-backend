import helpers from '../../utils/helper';
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkInsert('Users', [{
      username: 'alexis',
      email: 'alexismajyambere@gmail.com',
      password: helpers.hashPassword('12345678UUi@'),
      isverified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  ]),
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkDelete('Users', null, {})
  ])
};
