

module.exports = (sequelize, DataTypes) => {
  const RoomVisitType = sequelize.define('RoomVisitType', {
    roomId: DataTypes.INTEGER,
    visitTypeId: DataTypes.INTEGER
  }, {});
  RoomVisitType.associate = function(models) {
    const { Room, VisitType } = models
    RoomVisitType.belongsTo(Room, {
      as: 'room',
      foreignKey: 'roomId'
    })
    RoomVisitType.belongsTo(VisitType, {
      as: 'visitType',
      foreignKey: 'visitTypeId'
    })
  };
  return RoomVisitType;
};
