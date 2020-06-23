import AWS from 'aws-sdk';

import moment from 'moment-timezone';
import { respSuccess } from './utils/callbackResponses';
import { dig } from './utils';

const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-west-2',
  convertEmptyValues: true,
});
exports.index = async (event, context, callback) => {
  const date =
    dig(event, 'queryStringParameters', 'date') ||
    moment().format('YYYY-MM-DD');
  const params = {
    TableName: 'my-studio-staging-ClassEventStudentsTable',
    IndexName: 'StudentIndex',
    KeyConditionExpression:
      'StudentId = :hkey and begins_with(ClassDate, :rkey)',
    ExpressionAttributeValues: {
      ':hkey': 0,
      ':rkey': date,
    },
  };

  const respClassEvents = await documentClient.query(params).promise();
  callback(null, respSuccess(respClassEvents));
};

exports.show = async (event, context, callback) => {
  const { classTypeId, classDate } = event.pathParameters;
  const params = {
    TableName: 'my-studio-staging-ClassEventStudentsTable',
    IndexName: 'ClassTypeIndex',
    KeyConditionExpression:
      'ClassTypeId = :hkey and begins_with(ClassDate, :rkey)',
    ExpressionAttributeValues: {
      ':hkey': parseInt(classTypeId),
      ':rkey': decodeURIComponent(classDate),
    },
  };

  const respClassEvent = await documentClient.query(params).promise();
  callback(null, respSuccess(respClassEvent));
};
