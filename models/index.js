const mysql2 = require('mysql2');
const Sequelize = require('sequelize');

const env       = process.env.STAGE || 'dev';
const config    = require('config/config.json')[env];

config.dialect = 'mysql';
config.dialectModule = mysql2;

const db          = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const context = require.context('.', true, /^\.\/(?!index\.js).*\.js$/, 'sync')
context.keys().map(context).forEach(module => {
  const sequelizeModel = module(sequelize, Sequelize);
  db[sequelizeModel.name] = sequelizeModel;
})

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
