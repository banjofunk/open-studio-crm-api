import { Address, Location, Room } from 'models';
import { respSuccess, respServerError } from './utils/callbackResponses';

exports.index = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId } = event.pathParameters;
  const whereClause = { organizationId };
  if (organizationId === '0') delete whereClause.organizationId;
  Location.findAndCountAll({
    where: whereClause,
    include: [
      { model: Room, as: 'rooms', where: { active: true } },
      { model: Address, as: 'address' },
    ],
  }).then(locations => callback(null, respSuccess(locations)));
};

exports.show = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId, locationId } = event.pathParameters;
  const whereClause = { organizationId, id: locationId };
  if (organizationId === '0') delete whereClause.organizationId;
  Location.findOne({
    where: whereClause,
    include: [
      { model: Room, as: 'rooms', where: { active: true } },
      { model: Address, as: 'address' },
    ],
  }).then(location => callback(null, respSuccess(location)));
};

exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId } = event.pathParameters;
  const newLocation = JSON.parse(event.body);
  newLocation.organizationId = organizationId;
  newLocation.rooms = [];
  Location.create(newLocation, {
    include: [{ model: Room, as: 'rooms' }],
  })
    .then(location => callback(null, respSuccess(location)))
    .catch(err => callback('error', respServerError(err)));
};

exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { locationId } = event.pathParameters;
  const { location } = JSON.parse(event.body);
  Location.findById(locationId, {
    include: [{ model: Room, as: 'rooms' }, { model: Address, as: 'address' }],
  })
    .then(dbLocation => dbLocation.update(location))
    .then(dbLocation => callback(null, respSuccess(dbLocation)));
};

exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { locationId } = event.pathParameters;
  Location.destroy({
    where: { id: locationId },
  }).then(() => callback(null, respSuccess(locationId)));
};
