const AWS = require('aws-sdk');

const lambda = new AWS.Lambda();
// const dig = require('./utils/dig')

exports.handler = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('records count', event.Records.length);

  return Promise.all(
    event.Records.map(record => {
      const { parser, data } = JSON.parse(record.body);
      console.log('parser', parser);
      const params = {
        FunctionName: `my-studio-api-${process.env.STAGE}-importMindbodyData`,
        Payload: JSON.stringify({ parser, data }),
      };
      return lambda.invoke(params).promise();
    })
  );
};
