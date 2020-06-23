
module.exports = (sequelize, DataTypes) => {
  const PhoneNumber = sequelize.define('PhoneNumber', {
    phoneable: DataTypes.STRING,
    phoneableId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    number: DataTypes.STRING
  }, {});
  return PhoneNumber;
};
