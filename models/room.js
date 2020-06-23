
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    organizationId: DataTypes.INTEGER,
    mindbodyId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    locationId: DataTypes.INTEGER,
    acceptsClasses: DataTypes.BOOLEAN,
    acceptsAppointments: DataTypes.BOOLEAN,
    acceptsEnrollments: DataTypes.BOOLEAN,
    hasSchedules: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN
  }, {});
  Room.associate = (models) => {
    const { ClassEvent, Location } = models
    Room.belongsTo(Location, {
      as: 'location',
      foreignKey: 'LocationId'
    })
    Room.hasMany(ClassEvent, {
      as: 'classEvents',
      foreignKey: 'classTypeId'
    })
  };
  return Room;
};
