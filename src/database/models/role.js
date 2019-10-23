/**
 * @swagger
 *
 * definitions:
 *   Role:
 *     type: object
 *     required:
 *       - roleName
 *       - roleValue
 *     properties:
 *       roleName:
 *         type: string
 *       roleValue:
 *         type: string
 *       createdAt:
 *         type: string
 *       updatedAt: 
 *         type: string
 */
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    roleName: { type: DataTypes.STRING, allowNull: false },
    roleValue: { type: DataTypes.STRING,  allowNull: false },
  }, { freezeTableName: true });
  Roles.associate = function(models) {
  };
  return Roles;
};
