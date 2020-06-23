

module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    addressable: DataTypes.STRING,
    addressableId: DataTypes.INTEGER,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING
  }, {});
  return Address;
};