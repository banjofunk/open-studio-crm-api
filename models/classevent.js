

module.exports = (sequelize, DataTypes) => {
  const ClassEvent = sequelize.define('ClassEvent', {
    time: DataTypes.TIME,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    title: DataTypes.STRING,
  }, {});
  ClassEvent.associate = (models) => {
    const { ClassEventUser, ClassType, Room, User } = models
    ClassEvent.belongsTo(User, {
      as: 'teacher',
      foreignKey: 'teacherId'
    })
    ClassEvent.belongsTo(Room, {
      as: 'room',
      foreignKey: 'roomId'
    })
    ClassEvent.belongsTo(ClassType, {
      as: 'classType',
      foreignKey: 'classTypeId'
    })
    ClassEvent.belongsToMany(User, {
      as: 'students',
      through: ClassEventUser
    })
  };
  return ClassEvent;
};
