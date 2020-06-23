import AWS from 'aws-sdk';
import { ClassType } from 'models';
import { dig } from 'functions/utils';

const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

const classTypesParser = async () => {
  const params = {
    TableName: 'ClassTypesTable',
  };
  const dbClassTypes = await documentClient
    .scan(params)
    .promise()
    .then(data => data.Items);
  const classTypes = dbClassTypes.map(dbClassType => ({
    organizationId: 1,
    mindbodyId: dbClassType.id,
    active: dbClassType.active,
    name: dbClassType.name,
    description: dbClassType.description,
    imgUrl: dbClassType.imgUrl,
    classCategory: dig(dbClassType, 'classCategory', 'name'),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  const newClassTypes = await ClassType.bulkCreate(classTypes);
  return newClassTypes.length;
};

export default classTypesParser;
