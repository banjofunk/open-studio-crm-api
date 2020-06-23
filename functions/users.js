import { Address, Location, Organization, PhoneNumber, User } from 'models';
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
    // active: true,
    organizationId,
    [Op.or]: [
      { firstName: { [Op.like]: `%${filter}%` } },
      { lastName: { [Op.like]: `%${filter}%` } },
      { email: { [Op.like]: `%${filter}%` } },
      { badgeId: { [Op.like]: `%${filter}%` } },
    ],
  };
  if (organizationId === '0') delete whereClause.organizationId;
  User.findAll({
    offset,
    limit,
    where: whereClause,
    include: [
      { model: Location, as: 'location' },
      { model: Organization, as: 'organization' },
      { model: PhoneNumber, as: 'phoneNumbers' },
      { model: Address, as: 'address' },
      { model: Address, as: 'billingAddress' },
    ],
    order: [['lastName', 'ASC'], ['firstName', 'ASC']],
  }).then(results => callback(null, respSuccess(results)));
};

exports.show = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { userId } = event.pathParameters;
  User.findById(userId, {
    include: [
      { model: Location, as: 'location' },
      { model: Organization, as: 'organization' },
      { model: PhoneNumber, as: 'phoneNumbers' },
      { model: Address, as: 'address' },
      { model: Address, as: 'billingAddress' },
    ],
  }).then(user => callback(null, respSuccess(user)));
};

exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId } = event.pathParameters;
  const { user } = JSON.parse(event.body);
  user.organizationId = organizationId;
  user.roles = ['teacher'];
  User.create(user, {
    include: [],
  })
    .then(dbUser => callback(null, respSuccess(dbUser)))
    .catch(err => callback('error', respServerError(err)));
};

exports.update = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { userId } = event.pathParameters;
  const { user } = JSON.parse(event.body);
  const dbUser = await User.findById(userId, {
    include: [{ model: Address, as: 'address' }],
  }).then(respUser => respUser.update(user));
  if (user.address) {
    await dbUser.address.update(user.address);
  }
  callback(null, respSuccess(dbUser));
};

exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { userId } = event.pathParameters;
  User.destroy({
    where: { id: userId },
  }).then(() => callback(null, respSuccess(userId)));
};
