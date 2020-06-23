import { Room } from 'models';
import { respSuccess, respServerError } from './utils/callbackResponses';

exports.index = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { locationId } = event.pathParameters;
  const whereClause = { locationId, active: true };
  Room.findAll({
    where: whereClause,
  }).then(rooms => callback(null, respSuccess({ locationId, rooms })));
};

exports.show = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { roomId } = event.pathParameters;
  Room.findById(roomId).then(room => callback(null, respSuccess(room)));
};

exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { locationId, organizationId } = event.pathParameters;
  const newRoom = JSON.parse(event.body);
  newRoom.organizationId = organizationId;
  newRoom.locationId = locationId;
  Room.create(newRoom)
    .then(room => callback(null, respSuccess(room)))
    .catch(err => callback('error', respServerError(err)));
};

exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { roomId } = event.pathParameters;
  const { room } = JSON.parse(event.body);
  Room.findById(roomId)
    .then(dbRoom => dbRoom.update(room))
    .then(dbRoom => callback(null, respSuccess(dbRoom)));
};

exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { roomId } = event.pathParameters;
  Room.destroy({
    where: { id: roomId },
  }).then(() => {
    callback(null, respSuccess(roomId));
  });
};
