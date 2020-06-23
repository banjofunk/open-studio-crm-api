import AWS from 'aws-sdk';
import { sendToQueue } from 'functions/utils';

const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-west-2',
  convertEmptyValues: true,
});

const ClassEventsParser = async (startKey = false) => {
  const params = {
    TableName: 'ClassEventsTable',
  };
  if (startKey) {
    params.ExclusiveStartKey = startKey;
  }

  const dbClassEvents = await documentClient.scan(params).promise();
  const newStartKey = dbClassEvents.LastEvaluatedKey || false;
  await Promise.all(
    dbClassEvents.Items.map(dbClassEvent =>
      sendToQueue(dbClassEvent, 'classEvent')
    )
  );
  if (newStartKey) {
    await sendToQueue(newStartKey, 'classEvents');
  }
  console.log('classEvents count:', dbClassEvents.Items.length);
  console.log('next key:', newStartKey);
  return newStartKey;
};

export default ClassEventsParser;
