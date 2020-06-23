
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('StaffMembers', {
      id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
      organizationId: {
        type: Sequelize.INTEGER
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      appointmentPayRates:{
        type: Sequelize.JSON
      },
      description: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      mindbodyId: {
        type: Sequelize.INTEGER
      },
      roles: {
        type: Sequelize.JSON
      },
      lastName: {
        type: Sequelize.STRING
      },
      payRates: {
        type: Sequelize.JSON
      },
      createdAt: {
          type: Sequelize.DATE,
          allowNull: false
      },
      updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
      }
    }),

  down: (queryInterface) => queryInterface.dropTable('StaffMembers')
};
