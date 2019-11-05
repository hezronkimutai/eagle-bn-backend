/**
 * @swagger
 *
 * definitions:
 *   Accommodation:
 *     type: object
 *     required:
 *     properties:
 *       id:
 *         type: string
 *       userid:
 *         type: string
 *       description:
 *         type: string
 *       address:
 *         type: string
 *       availableSpace: 
 *         type: string
 *       cost:
 *         type: string
 *       services:
 *         type: string
 *       amenities: 
 *         type: string
 */
/**
 * @swagger
 *
 * definitions:
 *   editAccommodation:
 *     type: object
 *     required:
 *       - UserId
 *       - name
 *       - description
 *       - address
 *       - availablesspace
 *       - services
 *       - cost
 *       - amenities
 *     properties:
 *       userId:
 *         type: integer
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       address:
 *         type: string
 *       availablesspace:
 *         type: string
 *       services:
 *         type: string
 *       cost:
 *         type: integer
 *       amenities:
 *         type: string
 *       tcreatedAt:
 *         type: string
 *       updatedAt: 
 *         type: string
 */
module.exports = (sequelize, DataTypes) => {
  const Accommodation = sequelize.define('Accommodations', {
    userid: DataTypes.INTEGER,
    name:DataTypes.STRING,
    description: DataTypes.STRING,
    address: DataTypes.STRING,
    availableSpace: DataTypes.STRING,
    cost: DataTypes.DOUBLE,
    services: DataTypes.STRING,
    amenities: DataTypes.STRING
  }, { freezeTableName: true });
  Accommodation.associate = function(models) {
      Accommodation.belongsTo(models.Users, {
          foreignKey: 'userid',
          targetKey: 'id',
        });
  Accommodation.hasMany(models.AccommodationImages, {
    foreignKey: 'accommodationid',
    targetKey: 'id',
  });
  };
  return Accommodation;
};
