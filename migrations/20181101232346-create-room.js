
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mindbodyId: {
        type: Sequelize.INTEGER
      },
      organizationId: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      locationId: {
        type: Sequelize.INTEGER
      },
      acceptsClasses: {
        type: Sequelize.BOOLEAN
      },
      acceptsAppointments: {
        type: Sequelize.BOOLEAN
      },
      acceptsEnrollments: {
        type: Sequelize.BOOLEAN
      },
      hasSchedules: {
        type: Sequelize.BOOLEAN
      },
      active: {
        type: Sequelize.BOOLEAN
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
  down: (queryInterface) => queryInterface.dropTable('Rooms')
};
