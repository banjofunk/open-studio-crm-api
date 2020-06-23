

module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    name: DataTypes.STRING
  }, {});
  Location.associate = function(models) {
    const { Address, Organization, Room } = models
    Location.hasOne(Address, {
      as: 'address',
      foreignKey: 'addressableId',
      constraints: false,
      scope: {
        addressable: 'location'
      }
    })
    Location.belongsTo(Organization,{
      as: 'organization',
      foreignKey: 'organizationId'
    })
    Location.hasMany(Room, {
      as: 'rooms',
      foreignKey: 'locationId'
    })
  };
  return Location;
};
