'use strict';
module.exports = (sequelize, DataTypes) => {
  const MindbodyToken = sequelize.define('MindbodyToken', {
    organizationId: DataTypes.INTEGER,
    token: DataTypes.TEXT
  }, {});
  MindbodyToken.associate = function(models) {
    const { Organization } = models
    MindbodyToken.belongsTo(Organization, {
      as: 'organization',
      foreignKey: 'organizationId'
    })
  };
  return MindbodyToken;
};
