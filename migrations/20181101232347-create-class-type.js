

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ClassTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      name: {
        type: Sequelize.STRING
      },
      mindbodyId: {
        type: Sequelize.INTEGER
      },
      organizationId: {
        type: Sequelize.INTEGER
      },
      duration: {
        type: Sequelize.INTEGER,
        defaultValue: 60
      },
      description: {
        type: Sequelize.TEXT,
        defaultValue: ''
      },
      classCategory: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      imgUrl: {
        type: Sequelize.STRING,
        defaultValue: ''
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: (queryInterface) => queryInterface.dropTable('ClassTypes')
};
