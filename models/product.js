
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    organizationId: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    soldOnline: DataTypes.BOOLEAN,
    quickCash: DataTypes.BOOLEAN,
    mindbodyId: DataTypes.INTEGER,
    reorderLevel: DataTypes.STRING,
    categoryName: DataTypes.STRING,
    subcategoryName: DataTypes.STRING,
    posFavorite: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    sizeName: DataTypes.STRING,
    weight: DataTypes.STRING,
    sizeId: DataTypes.INTEGER,
    supplierId: DataTypes.INTEGER,
    supplierName: DataTypes.STRING,
    lotSize: DataTypes.STRING,
    colorName: DataTypes.STRING,
    barcode: DataTypes.STRING,
    locations: DataTypes.STRING,
    description: DataTypes.TEXT,
    notes: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    inventory: DataTypes.JSON,
    onlinePrice: DataTypes.INTEGER,
  }, {});
  Product.associate = (models) => {
    const { Organization } = models
    Product.belongsTo(Organization, {
      as: 'organization',
      foreignKey: 'organizationId'
    })
  };
  return Product;
};
