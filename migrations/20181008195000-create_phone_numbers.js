

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('PhoneNumbers', {
      id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
      phoneable: {
        type: Sequelize.STRING
      },
      phoneableId: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      number: {
        type: Sequelize.STRING
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

  down: (queryInterface) => queryInterface.dropTable('PhoneNumbers')
};
