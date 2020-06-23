'use strict';
module.exports = (sequelize, DataTypes) => {
  const ClassEventUser = sequelize.define('ClassEventUser', {
    classEventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  return ClassEventUser;
};
