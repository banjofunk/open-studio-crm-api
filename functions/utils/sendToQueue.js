const AWS = require('aws-sdk');

const sqs = new AWS.SQS({ region: 'us-west-2' });

const sendToQueue = async (data, parser) => {
  const params = {
    MessageBody: JSON.stringify({ parser, data }),
    QueueUrl: process.env.ParserQueueUrl,
  };
  return sqs.sendMessage(params).promise();
};

export default sendToQueue;
