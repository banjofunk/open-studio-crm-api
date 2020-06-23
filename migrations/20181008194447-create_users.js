

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
      id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
      },
      locationId: {
        type: Sequelize.INTEGER
      },
      organizationId: {
        type: Sequelize.INTEGER
      },
      badgeId: {
          type: Sequelize.STRING
      },
      mindbodyId: {
          type: Sequelize.INTEGER
      },
      cognitoId: {
          type: Sequelize.STRING
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
      lastName: {
          type: Sequelize.STRING
      },
      roles: {
          type: Sequelize.STRING
      },
      birthday: {
          type: Sequelize.STRING
      },
      phone: {
          type: Sequelize.STRING
      },
      gender: {
          type: Sequelize.STRING
      },
      status: {
          type: Sequelize.STRING
      },
      preferences: {
          type: Sequelize.JSON
      },
      relationships: {
          type: Sequelize.JSON
      },
      emergencyContact: {
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

  down: (queryInterface) => queryInterface.dropTable('Users')
};
