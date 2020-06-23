

module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define('Organization', {
    name: DataTypes.STRING
  }, {});
  Organization.associate = (models) => {
    const { Address, ClassType, Location, MindbodyToken, User, VisitType } = models
    Organization.hasMany(Address, {
      as: 'addresses',
      foreignKey: 'addressableId',
      constraints: false,
      scope: {
        addressable: 'organization'
      }
    })
    Organization.belongsTo(Address, {
      as: 'primaryAddress',
      foreignKey: 'primaryAddressId'
    })
    Organization.hasMany(VisitType, {
      as: 'visitTypes',
      foreignKey: 'organizationId'
    })
    Organization.hasMany(ClassType, {
      as: 'classTypes',
      foreignKey: 'organizationId'
    })
    Organization.hasMany(Location, {
      as: 'locations',
      foreignKey: 'organizationId'
    })
    Organization.hasMany(User, {
      as: 'users',
      foreignKey: 'organizationId'
    })
    Organization.hasOne(MindbodyToken, {
      as: 'mindbodyToken',
      foreignKey: 'organizationId'
    })
  };

  return Organization;
}
