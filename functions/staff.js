import { StaffMember } from 'models';
import { respSuccess } from './utils/callbackResponses';

exports.show = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { staffId } = event.pathParameters;
  StaffMember.findAll({ where: { mindbodyId: staffId } }).then(staff =>
    callback(null, respSuccess(staff[0]))
  );
};
