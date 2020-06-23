
module.exports = (sequelize, DataTypes) => {
  const ClassType = sequelize.define('ClassType', {
    active: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    mindbodyId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    classCategory: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
  }, {});
  ClassType.associate = (models) => {
    const { ClassEvent, Organization } = models
    ClassType.belongsTo(Organization, {
      as: 'organization',
      foreignKey: 'organizationId'
    })
    ClassType.hasMany(ClassEvent, {
      as: 'classEvents',
      foreignKey: 'classTypeId'
    })
  };
  return ClassType;
};
