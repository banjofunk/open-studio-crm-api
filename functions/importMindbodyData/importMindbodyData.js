import {
  classTypesParser,
  productsParser,
  resourcesParser,
  usersParser,
  staffMembersParser,
  classEventParser,
  classEventsParser,
} from './parsers';

exports.handler = async event => {
  const { data, parser } = event;
  switch (parser) {
    case 'classTypes':
      await classTypesParser();
      break;
    case 'products':
      await productsParser();
      break;
    case 'resources':
      await resourcesParser();
      break;
    case 'users':
      await usersParser(data);
      break;
    case 'staffMembers':
      await staffMembersParser();
      break;
    case 'classEvents':
      await classEventsParser(data);
      break;
    case 'classEvent':
      await classEventParser(data);
      break;
    default:
      console.log('no parser');
      break;
  }
  return true;
};
