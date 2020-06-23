
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      organizationId: {
        type: Sequelize.INTEGER
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      soldOnline: {
        type: Sequelize.BOOLEAN
      },
      quickCash: {
        type: Sequelize.BOOLEAN
      },
      mindbodyId: {
        type: Sequelize.INTEGER
      },
      reorderLevel: {
        type: Sequelize.STRING
      },
      categoryName: {
        type: Sequelize.STRING
      },
      subcategoryName: {
        type: Sequelize.STRING
      },
      posFavorite: {
        type: Sequelize.BOOLEAN
      },
      name: {
        type: Sequelize.STRING
      },
      sizeName: {
        type: Sequelize.STRING
      },
      weight: {
        type: Sequelize.STRING
      },
      sizeId: {
        type: Sequelize.INTEGER
      },
      supplierId: {
        type: Sequelize.INTEGER
      },
      supplierName: {
        type: Sequelize.STRING
      },
      lotSize: {
        type: Sequelize.STRING
      },
      colorName: {
        type: Sequelize.STRING
      },
      barcode: {
        type: Sequelize.STRING
      },
      locations: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      notes: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.INTEGER
      },
      onlinePrice: {
        type: Sequelize.INTEGER
      },
      inventory: {
        type: Sequelize.JSON
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
  down: (queryInterface) => queryInterface.dropTable('Products')
};
