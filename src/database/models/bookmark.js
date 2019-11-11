'use strict';
module.exports = (sequelize, DataTypes) => {
  const bookmark = sequelize.define('Bookmarks', {
    UserId: DataTypes.INTEGER,
    AccommodationId: DataTypes.INTEGER,
  }, {});
  bookmark.associate = function(models) {
    bookmark.belongsTo(models.Users, {
      foreignKey: {
        allowNull: true,
      },
      onDelete: 'SET NULL',
  });
  bookmark.belongsTo(models.Accommodations, {
    foreignKey: {
      allowNull: true,
    },
    onDelete: 'SET NULL',
});
  };
  return bookmark;
};