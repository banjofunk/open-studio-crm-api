import {
  Address,
  ClassType,
  Location,
  MindbodyToken,
  Organization,
} from 'models';
import { respSuccess } from './utils/callbackResponses';

exports.index = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  Organization.findAndCountAll().then(organizations =>
    callback(null, respSuccess(organizations))
  );
};

exports.show = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId } = event.pathParameters;
  Organization.findById(organizationId, {
    include: [
      { model: Location, as: 'locations' },
      { model: ClassType, as: 'classTypes' },
      // { model: User, as: 'users' },
      { model: Address, as: 'addresses' },
      { model: MindbodyToken, as: 'mindbodyToken' },
    ],
  }).then(organization => callback(null, respSuccess(organization)));
};
