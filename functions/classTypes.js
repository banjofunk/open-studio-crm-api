import { ClassType } from 'models';
import { respSuccess, respServerError } from './utils/callbackResponses';

exports.index = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId } = event.pathParameters;
  const whereClause = { active: true, organizationId };
  if (organizationId === '0') delete whereClause.organizationId;
  ClassType.findAndCountAll({
    where: whereClause,
  }).then(classTypes => callback(null, respSuccess(classTypes)));
};

exports.show = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { classTypeId } = event.pathParameters;
  ClassType.findById(classTypeId, {}).then(classType =>
    callback(null, respSuccess(classType))
  );
};

exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId } = event.pathParameters;
  const { classType } = JSON.parse(event.body);
  classType.duration =
    classType.duration === '' ? 60 : parseInt(classType.duration);
  classType.organizationId = organizationId;
  ClassType.create(classType)
    .then(dbClassType => callback(null, respSuccess(dbClassType)))
    .catch(err => callback(null, respServerError(err)));
};

exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { classTypeId } = event.pathParameters;
  const { classType } = JSON.parse(event.body);
  ClassType.findById(classTypeId, {})
    .then(dbClassType => dbClassType.update(classType))
    .then(dbClassType => callback(null, respSuccess(dbClassType)));
};

exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { classTypeId } = event.pathParameters;
  ClassType.destroy({
    where: { id: classTypeId },
  }).then(() => callback(null, respSuccess(classTypeId)));
};
