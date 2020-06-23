
module.exports = (sequelize, DataTypes) => {
  const VisitType = sequelize.define('VisitType', {
    organizationId: DataTypes.INTEGER,
    category: DataTypes.STRING,
    name: DataTypes.STRING,
    displayName: DataTypes.STRING,
  }, {});
  VisitType.associate = (models) => {
    const { Organization } = models
    VisitType.belongsTo(Organization, {
      as: 'organization',
      foreignKey: 'organizationId'
    })
  };
  return VisitType;
};
