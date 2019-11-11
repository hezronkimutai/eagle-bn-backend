'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Bookmarks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
        }
      },
      AccommodationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        onDelete: 'CASCADE',
        references: {
          model: 'Accommodations',
          key: 'id',
        }
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    },
      {
      indexes: [
        {
            unique: true,
            fields: ['UserId', 'AccommodationId']
        }
        ]
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Bookmarks');
  }
};