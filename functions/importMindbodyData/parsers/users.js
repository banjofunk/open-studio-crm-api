import AWS from 'aws-sdk';
import { Address, Location, PhoneNumber, User } from 'models';
import { sendToQueue } from 'functions/utils';

const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

let locations;

const createUser = dbClient => {
  const location =
    locations.find(
      loc =>
        loc.name.toLocaleLowerCase() ===
        (dbClient.location || '').toLocaleLowerCase()
    ) || {};
  return User.create({
    organizationId: 1,
    badgeId: dbClient.barcode,
    mindbodyId: dbClient.id,
    firstName: dbClient.name.firstName,
    lastName: dbClient.name.lastName,
    phone: dbClient.phone.cellPhone,
    email: dbClient.email,
    birthday: dbClient.birthday,
    gender: dbClient.gender,
    status: dbClient.memberStatus,
    locationId: location.id,
    preferences: dbClient.reminderEmails,
    relationships: dbClient.relationships,
    emergencyContact: dbClient.emergencyContact,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
    .then(async user => {
      await Address.create({
        ...dbClient.address,
        addressable: 'user',
        addressableId: user.id,
      });
      return user;
    })
    .then(async user => {
      Object.keys(dbClient.phone);
      await Promise.all(
        Object.entries(dbClient.phone).map((key, value) => {
          if (value && typeof value === 'string') {
            return PhoneNumber.create({
              ...dbClient.address,
              phoneable: 'user',
              phoneableId: user.id,
              type: key,
              number: value.replace(/Phone/, ''),
            });
          }
          return Promise.resolve();
        })
      );
      return user;
    });
};

const usersParser = async (startKey = false) => {
  locations = await Location.findAll().map(loc => ({
    id: loc.id,
    name: loc.name,
  }));
  const params = {
    TableName: 'ClientsTable',
    Limit: 100,
  };
  if (startKey) {
    params.ExclusiveStartKey = startKey;
  }

  const dbUsers = await documentClient.scan(params).promise();
  const userCount = dbUsers.Items.length;
  const newStartKey = dbUsers.LastEvaluatedKey || false;
  console.log('params', params);
  await Promise.all(dbUsers.Items.map(async dbClient => createUser(dbClient)));
  if (newStartKey) {
    await sendToQueue(newStartKey, 'users');
  }
  return userCount;
};

export default usersParser;
