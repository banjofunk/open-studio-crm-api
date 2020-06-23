import { Address, Organization, PhoneNumber, StaffMember } from 'models';
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
      { firstName: { [Op.like]: `%${filter}%` } },
      { lastName: { [Op.like]: `%${filter}%` } },
      { email: { [Op.like]: `%${filter}%` } },
    ],
  };
  if (organizationId === '0') delete whereClause.organizationId;
  StaffMember.findAll({
    offset,
    limit,
    where: whereClause,
    include: [
      { model: Organization, as: 'organization' },
      { model: PhoneNumber, as: 'phoneNumbers' },
      { model: Address, as: 'address' },
    ],
    order: [['lastName', 'ASC'], ['firstName', 'ASC']],
  }).then(results => callback(null, respSuccess(results)));
};

exports.show = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { staffMemberid } = event.pathParameters;
  StaffMember.findById(staffMemberid).then(staffMember =>
    callback(null, respSuccess(staffMember))
  );
};

exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { organizationId } = event.pathParameters;
  const { staffMember } = JSON.parse(event.body);
  staffMember.organizationId = organizationId;
  staffMember.roles = ['teacher'];
  StaffMember.create(staffMember, {
    include: [],
  })
    .then(dbStaffMember => callback(null, respSuccess(dbStaffMember)))
    .catch(err => callback('error', respServerError(err)));
};

exports.update = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { staffMemberid } = event.pathParameters;
  const { staffMember } = JSON.parse(event.body);
  StaffMember.findById(staffMemberid, {})
    .then(dbStaffMember => dbStaffMember.update(staffMember))
    .then(dbStaffMember => callback(null, respSuccess(dbStaffMember)));
};

exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { staffMemberid } = event.pathParameters;
  StaffMember.destroy({
    where: { id: staffMemberid },
  }).then(() => callback(null, respSuccess(staffMemberid)));
};
