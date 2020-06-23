import AWS from 'aws-sdk';
import { ClassType, Product, VisitType, Room } from 'models';
import { respSuccess } from './utils/callbackResponses';
import { dig } from './utils';

const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

exports.classTypes = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const params = {
    TableName: 'ClassTypesTable',
  };

  const dbClassTypes = await documentClient
    .scan(params)
    .promise()
    .then(data => data.Items);
  console.log(dbClassTypes[0]);
  const classTypes = dbClassTypes.map(dbClassType => ({
    organizationId: 1,
    active: dbClassType.active,
    name: dbClassType.name,
    description: dbClassType.description,
    imgUrl: dbClassType.imgUrl,
    classCategory: dig(dbClassType, 'classCategory', 'name'),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  const newClassTypes = await ClassType.bulkCreate(classTypes);

  return newClassTypes.length;
};

exports.resources = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let params = {
    TableName: 'ServiceCategoryVisitTypesTable',
  };

  const dbVisitTypes = await documentClient
    .scan(params)
    .promise()
    .then(data => data.Items);
  const visitTypes = dbVisitTypes.map(dbVisitType => ({
    organizationId: 1,
    mbId: dbVisitType.id,
    category: dbVisitType.ServiceCategoryName,
    name: dbVisitType.VisitTypeName,
    displayName: dbVisitType.DisplayName,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  // console.log(visitTypes)

  await VisitType.bulkCreate(visitTypes);
  const newVisitTypes = {};
  await VisitType.bulkCreate(visitTypes)
    .then(() => VisitType.findAll())
    .then(rooms =>
      rooms.forEach(room => {
        newVisitTypes[room.name] = room.id;
      })
    );
  console.log(newVisitTypes);

  params = {
    TableName: 'ResourcesTable',
  };

  const dbResources = await documentClient
    .scan(params)
    .promise()
    .then(data => data.Items);
  const resources = dbResources.map(dbResource => ({
    name: dbResource.Name,
    visitTypes: dbResource.AllowedVisitTypeIds,
    locationId: dbResource.LocationId,
    acceptsClasses: dbResource.AcceptsClasses,
    acceptsAppointments: dbResource.AcceptsAppointments,
    acceptsEnrollments: dbResource.AcceptsEnrollments,
    hasSchedules: dbResource.HasSchedules,
    active: dbResource.Active,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  await Room.bulkCreate(resources).then(() => Room.findAll());

  return true;
};

exports.products = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

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
    name: dbProduct.name,
    sizeName: dbProduct.sizeName,
    weight: dbProduct.weight,
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

exports.users = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const params = {
    TableName: 'ClassTypesTable',
  };

  const dbClassTypes = await documentClient
    .scan(params)
    .promise()
    .then(data => data.Items)
    .catch(err => console.log(err));
  const classTypes = dbClassTypes.map(dbClassType => ({
    organizationId: 1,
    duration: 60,
    name: dbClassType.name,
    description: dbClassType.description,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  const newClassTypes = await ClassType.bulkCreate(classTypes);

  callback(null, respSuccess(newClassTypes));
};
