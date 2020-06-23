import AWS from 'aws-sdk';
import { Product } from 'models';

const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

const productsParser = async () => {
  const params = {
    TableName: 'ProductsTable',
  };
  const dbProducts = await documentClient
    .scan(params)
    .promise()
    .then(data => data.Items);
  const products = dbProducts.map(dbProduct => ({
    active: dbProduct.active,
    soldOnline: dbProduct.soldOnline,
    quickCash: dbProduct.quickCash,
    reorderLevel: dbProduct.reorderLevel,
    categoryName: dbProduct.categoryName,
    subcategoryName: dbProduct.subcategoryName,
    posFavorite: dbProduct.posFavorite,
    inventory: dbProduct.inventory.map(inv => ({
      amount: parseInt(inv.amount),
      locationId: inv.location === 'Redmond' ? 2 : 1,
    })),
    name: dbProduct.name,
    sizeName: dbProduct.sizeName,
    weight: dbProduct.weight,
    mindbodyId: dbProduct.id,
    sizeId: dbProduct.sizeId,
    supplierId: dbProduct.supplierId,
    supplierName: dbProduct.supplierName,
    lotSize: dbProduct.lotSize,
    colorName: dbProduct.colorName,
    barcode: dbProduct.barcode,
    locations: dbProduct.locations,
    description: dbProduct.description,
    notes: dbProduct.notes,
    price: dbProduct.price,
    onlinePrice: dbProduct.onlinePrice,
    organizationId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  const newProducts = await Product.bulkCreate(products);
  return newProducts.length;
};

export default productsParser;
