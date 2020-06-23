import { Product } from 'models';
import { Op } from 'sequelize';
import { respSuccess, respServerError } from './utils/callbackResponses';
import { dig } from './utils';

exports.index = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId } = event.pathParameters;
  const page = dig(event, 'queryStringParameters', 'page') || 1;
  const limit = 40;
  const offset = limit * (page > 0 ? page - 1 : 0);
  const filter = dig(event, 'queryStringParameters', 'filter') || '';
  const whereClause = {
    organizationId,
    [Op.or]: [
      { name: { [Op.like]: `%${filter}%` } },
      { sizeName: { [Op.like]: `%${filter}%` } },
      { supplierName: { [Op.like]: `%${filter}%` } },
      { categoryName: { [Op.like]: `%${filter}%` } },
      { colorName: { [Op.like]: `%${filter}%` } },
    ],
  };
  if (organizationId === '0') delete whereClause.organizationId;

  Product.findAll({
    where: whereClause,
    offset,
    limit,
  }).then(products => callback(null, respSuccess(products)));
};

exports.show = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  // const { organizationId, productId } = event.pathParameters;
  const { productId } = event.pathParameters;
  const whereClause = { id: productId };
  // if (organizationId === '0') delete whereClause.organizationId;
  Product.findOne({
    where: whereClause,
  }).then(product => callback(null, respSuccess(product)));
};

exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId } = event.pathParameters;
  const newProduct = JSON.parse(event.body);
  newProduct.organizationId = organizationId;
  newProduct.rooms = [];
  Product.create(newProduct)
    .then(product => callback(null, respSuccess(product)))
    .catch(err => callback('error', respServerError(err)));
};

exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { productId } = event.pathParameters;
  const { product } = JSON.parse(event.body);
  Product.findById(productId)
    .then(dbProduct => dbProduct.update(product))
    .then(dbProduct => callback(null, respSuccess(dbProduct)));
};

exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { productId } = event.pathParameters;
  Product.destroy({
    where: { id: productId },
  }).then(() => callback(null, respSuccess(productId)));
};
