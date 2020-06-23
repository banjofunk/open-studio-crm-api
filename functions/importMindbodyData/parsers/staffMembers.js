import AWS from 'aws-sdk';
import { Address, PhoneNumber, StaffMember } from 'models';

const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

const createStaffMember = dbStaffMember =>
  StaffMember.create({
    organizationId: 1,
    badgeId: dbStaffMember.badgeId,
    active: dbStaffMember.active,
    appointmentPayRates: dbStaffMember.appointmentPayRates,
    description: dbStaffMember.description,
    email: dbStaffMember.email,
    firstName: dbStaffMember.firstname,
    gender: dbStaffMember.gender,
    mindbodyId: dbStaffMember.id,
    roles: {
      isAssistant1: dbStaffMember.isassistant1,
      isAssistant2: dbStaffMember.isassistant2,
      isEmployee: dbStaffMember.isemployee,
      isInstructor: dbStaffMember.isinstructor,
      isRep: dbStaffMember.isrep,
      isTeacher: dbStaffMember.isteacher,
    },
    lastName: dbStaffMember.lastname,
    payRates: dbStaffMember.payRates,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).then(async staffMember => {
    if (dbStaffMember.address) {
      await Address.create({
        address1: dbStaffMember.address,
        city: dbStaffMember.city,
        zip: dbStaffMember.zip,
        addressable: 'staff-member',
        addressableId: staffMember.id,
      });
    }
    if (
      dbStaffMember.cellPhone &&
      typeof dbStaffMember.cellPhone === 'string'
    ) {
      await PhoneNumber.create({
        phoneable: 'staff-member',
        phoneableId: staffMember.id,
        type: 'cellPhone',
        number: dbStaffMember.cellPhone,
      });
    }
    if (
      dbStaffMember.homePhone &&
      typeof dbStaffMember.homePhone === 'string'
    ) {
      await PhoneNumber.create({
        phoneable: 'staff-member',
        phoneableId: staffMember.id,
        type: 'homePhone',
        number: dbStaffMember.homePhone,
      });
    }
    return staffMember;
  });

const staffMembersParser = async () => {
  const params = {
    TableName: 'StaffTable',
  };

  let dbStaffMembers = await documentClient.scan(params).promise();
  let staffCount = dbStaffMembers.Items.length;
  params.ExclusiveStartKey = dbStaffMembers.LastEvaluatedKey || false;
  await Promise.all(
    dbStaffMembers.Items.map(dbStaffMember => createStaffMember(dbStaffMember))
  );
  while (params.ExclusiveStartKey) {
    dbStaffMembers = await documentClient.scan(params).promise();
    staffCount += dbStaffMembers.Items.length;
    params.ExclusiveStartKey = dbStaffMembers.LastEvaluatedKey || false;
    await Promise.all(
      dbStaffMembers.Items.map(dbStaffMember =>
        createStaffMember(dbStaffMember)
      )
    );
  }
  console.log('staff count', staffCount);

  return staffCount;
};

export default staffMembersParser;
