/* eslint no-console: ["error", { allow: ["log", "error"] }] */
import AWS from 'aws-sdk';
import dig from 'object-dig';
import { User } from 'models';
import { respSuccess, respServerError } from './utils/callbackResponses';
import { checkAuthGroup } from './utils';

const cognitoIdentityService = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'us-west-2',
});

const createLocalUser = data => {
  const email = dig(data, 'Attributes').find(att => att.Name === 'email').Value;
  const userParams = {
    organizationId: 1,
    cognitoId: dig(data, 'Username'),
    firstName: dig(data, 'Attributes').find(att => att.Name === 'name').Value,
    lastName: dig(data, 'Attributes').find(att => att.Name === 'family_name')
      .Value,
    badgeId: dig(data, 'Attributes').find(att => att.Name === 'badge_id').Value,
    email,
    phone: dig(data, 'Attributes').find(att => att.Name === 'phone_number')
      .Value,
    roles: ['teacher'],
  };
  return User.find({ where: { email } }).then(user => {
    if (!user) {
      User.create(userParams);
    } else {
      console.error('User already exists');
    }
    return true;
  });
};

const addUserToTeachers = async data => {
  const params = {
    UserPoolId: 'us-west-2_PsG59UC2E',
    Username: dig(data, 'User', 'Username'),
    GroupName: 'teacher',
  };
  return cognitoIdentityService
    .adminAddUserToGroup(params)
    .promise()
    .then(cognitoData =>
      console.log('add user to group success -------------->', cognitoData)
    )
    .catch(err =>
      console.error('add user to group error -------------->', err)
    );
};

exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const UserPoolId = 'us-west-2_PsG59UC2E';
  const action = dig(event, 'pathParameters', 'action');
  let params;
  const { GroupName, Username, Limit, NextToken, Filter } =
    JSON.parse(event.body) || {};
  switch (action) {
    case 'create-user':
      params = JSON.parse(event.body);
      await cognitoIdentityService
        .adminCreateUser(params)
        .promise()
        .then(data => callback(null, respSuccess(data)))
        .catch(err => callback(null, respServerError(err)));
      break;
    case 'get-user':
      params = { UserPoolId, Username };
      console.log('get-user', params);
      await cognitoIdentityService
        .adminGetUser(params)
        .promise()
        .then(data => callback(null, respSuccess(data)))
        .catch(err => callback(null, respServerError(err)));
      break;
    case 'get-user-groups':
      params = { UserPoolId, Username };
      await cognitoIdentityService
        .adminListGroupsForUser(params)
        .promise()
        .then(data => {
          const groups = dig(data, 'Groups') || [];
          const groupNames = groups.map(group => dig(group, 'GroupName'));
          callback(null, respSuccess(groupNames));
        })
        .catch(err => callback(null, respServerError(err)));
      break;
    case 'seed-users':
      params = { UserPoolId, Filter };
      await cognitoIdentityService
        .listUsers(params)
        .promise()
        .then(async data => {
          const users = dig(data, 'Users');
          await users.forEach((user, i) => {
            setTimeout(createLocalUser(user), i * 10);
          });
          callback(null, respSuccess(data));
        })
        .catch(err => callback(null, respServerError(err)));
      break;
    case 'list-users':
      params = { UserPoolId, Filter };
      await cognitoIdentityService
        .listUsers(params)
        .promise()
        .then(data => callback(null, respSuccess(data)))
        .catch(err => callback(null, respServerError(err)));
      break;
    case 'delete-users':
      params = { UserPoolId };
      await cognitoIdentityService
        .listUsers(params)
        .promise()
        .then(async data => {
          const subs = data.Users.map(user => user.Username);
          await subs.forEach(async sub => {
            await cognitoIdentityService
              .adminDeleteUser({ UserPoolId, Username: sub })
              .promise()
              .then(deletedData => console.log('deletedData:', deletedData));
          });
          callback(null, respSuccess(subs));
        })
        .catch(err => callback(null, respServerError(err)));
      break;
    case 'list-users-in-group':
      params = { UserPoolId, GroupName, Limit, NextToken };
      await cognitoIdentityService
        .listUsersInGroup(params)
        .promise()
        .then(data => callback(null, respSuccess(data)))
        .catch(err => callback(null, respServerError(err)));
      break;
    case 'add-user-to-group':
      params = { GroupName, Username, UserPoolId };
      if (checkAuthGroup(event, 'admin')) {
        await cognitoIdentityService
          .adminAddUserToGroup(params)
          .promise()
          .then(data => callback(null, respSuccess(data)))
          .catch(err => callback(null, respServerError(err)));
      } else {
        callback(null, respServerError({ error: 'Not Authorized' }));
      }
      break;
    case 'remove-user-from-group':
      params = { GroupName, Username, UserPoolId };
      if (checkAuthGroup(event, 'admin')) {
        await cognitoIdentityService
          .adminRemoveUserFromGroup(params)
          .promise()
          .then(data => callback(null, respSuccess(data)))
          .catch(err => callback(null, respServerError(err)));
      } else {
        callback(null, respServerError({ error: 'Not Authorized' }));
      }
      break;
    default:
      callback(null, respServerError({ error: 'function not found' }));
      break;
  }
};

const teachers = [
  {
    firstName: 'Alisha',
    lastName: 'Smith',
    phone: '',
    email: 'alishasmithyoga@hotmail.com',
  },
  {
    firstName: 'Amanda',
    lastName: 'Bird',
    phone: '+16168944668',
    email: 'bird.amanda@live.com',
  },
  {
    firstName: 'Amber',
    lastName: 'Cornelius',
    phone: '',
    email: 'ambercornelius32@gmail.com',
    badgeId: '100000282',
  },
  {
    firstName: 'Amber Dawn',
    lastName: 'Carroll',
    phone: '',
    email: 'acarroll2@cocc.edu',
    badgeId: '100000232',
  },
  {
    firstName: 'Amber Lea',
    lastName: 'Chenault',
    phone: '+15038609080',
    email: 'amberleac@hotmail.com',
    badgeId: '100000212',
  },
  {
    firstName: 'Amy',
    lastName: 'Coronado',
    phone: '+13103830552',
    email: 'amy.coronado10@yahoo.com',
    badgeId: '100000278',
  },
  {
    firstName: 'Anna',
    lastName: 'Junkins',
    phone: '',
    email: 'annalouisejunkins@gmail.com',
  },
  {
    firstName: 'Anna',
    lastName: 'Kaufman',
    phone: '+18027937243',
    email: 'anna.r.kaufman@gmail.com',
    badgeId: '100000250',
  },
  {
    firstName: 'Ben',
    lastName: 'Schade',
    phone: '+15055732576',
    email: 'steelschade@hotmail.com',
  },
  {
    firstName: 'Bobbi',
    lastName: 'Vercruysse',
    phone: '+15416998881',
    email: 'bobbi_vercruysse@rpacademy.org',
  },
  {
    firstName: 'Brandy',
    lastName: 'Berlin',
    phone: '+15414209020',
    email: 'brandyberlin@gmail.com',
    badgeId: '100000161',
  },
  {
    firstName: 'Brianna',
    lastName: 'Mckinnell',
    phone: '',
    email: 'briana.mckinnel@gmail.com',
    badgeId: '100000293',
  },
  {
    firstName: 'Caitlin',
    lastName: 'Kelly',
    phone: '+16159676446',
    email: 'caitlinowenkelly@gmail.com',
    badgeId: '100000271',
  },
  {
    firstName: 'Cathy',
    lastName: 'Lawgates',
    phone: '',
    email: 'lawgator@bendbroadband.com',
  },
  {
    firstName: 'Claire',
    lastName: 'Colwell',
    phone: '+12088418554',
    email: 'cmcolwell93@outlook.com',
  },
  {
    firstName: 'Corrie',
    lastName: 'Bernard',
    phone: '+15414197969',
    email: 'corriebernard@gmail.com',
    badgeId: '100000027',
  },
  {
    firstName: 'Deven',
    lastName: 'Sisler',
    phone: '',
    email: 'acroyogadeven@gmail.com',
    badgeId: '100000117',
  },
  {
    firstName: 'Emily',
    lastName: 'Anderson',
    phone: '',
    email: 'emily111213@gmail.com',
    badgeId: '100000256',
  },
  {
    firstName: 'Greg',
    lastName: 'Skarvelis',
    phone: '+13035514111',
    email: 'gskarvelis@gmail.com',
    badgeId: '100000279',
  },
  {
    firstName: 'Halie',
    lastName: 'Taylor',
    phone: '+15412137045',
    email: 'sacredgrounding@gmail.com',
  },
  {
    firstName: 'Jacob',
    lastName: 'Robe',
    phone: '+18316015636',
    email: 'jacobgrobe@gmail.com',
    badgeId: '100000286',
  },
  {
    firstName: 'Jaimie',
    lastName: 'Hamman',
    phone: '+15412809195',
    email: 'jaimieyogacat@gmail.com',
    badgeId: '100000248',
  },
  {
    firstName: 'Janessa',
    lastName: 'Reynolds',
    phone: '',
    email: 'janessamreynolds@gmail.com',
    badgeId: '100000263',
  },
  {
    firstName: 'Jenna',
    lastName: 'Wazny',
    phone: '+19703430102',
    email: 'jennawaz@gmail.com',
    badgeId: '100000170',
  },
  {
    firstName: 'Julie',
    lastName: 'Bertagna',
    phone: '+15414102183',
    email: 'jalowes@hotmail.com',
    badgeId: '100000042',
  },
  {
    firstName: 'Kady',
    lastName: 'Stapes',
    phone: '+15419132608',
    email: 'fuffels007@aol.com',
  },
  {
    firstName: 'Kari',
    lastName: 'Sieler',
    phone: '+15415088080',
    email: 'kari.dyan@gmail.com',
    badgeId: '100000247',
  },
  {
    firstName: 'Kelly',
    lastName: 'Nie',
    phone: '',
    email: 'kellymichellenie@gmail.com',
    badgeId: '100000140',
  },
  {
    firstName: 'Ken',
    lastName: 'Cheloti',
    phone: '',
    email: 'Chelotiken@gmail.com',
    badgeId: '100000295',
  },
  {
    firstName: 'Keshia',
    lastName: 'Gray',
    phone: '',
    email: 'grayk2405@yahoo.com',
    badgeId: '100000246',
  },
  {
    firstName: 'Kristen',
    lastName: 'Lewallen',
    phone: '+15037564291',
    email: 'kristenworthlewallen@gmail.com',
    badgeId: '100000209',
  },
  {
    firstName: 'Kristi',
    lastName: 'Kasko',
    phone: '+18143842980',
    email: 'kristi.kasko@gmail.com',
    badgeId: '100000187',
  },
  {
    firstName: 'Laura',
    lastName: 'Jones',
    phone: '+19134262816',
    email: 'laurajonesOR@gmail.com',
  },
  {
    firstName: 'Leigh',
    lastName: 'Cepriano',
    phone: '',
    email: 'applecrab13@gmail.com',
    badgeId: '100000275',
  },
  {
    firstName: 'Lesley',
    lastName: 'Barr',
    phone: '+15416392355',
    email: 'lesleysmeshly@gmail.com',
    badgeId: '100000274',
  },
  {
    firstName: 'Lexi',
    lastName: 'Rhodes',
    phone: '+14087615585',
    email: 'lexi_rhodes@yahoo.com',
    badgeId: '100000270',
  },
  {
    firstName: 'Libby',
    lastName: 'Nierman',
    phone: '+15414100909',
    email: 'emnierman@gmail.com',
    badgeId: '100000182',
  },
  {
    firstName: 'Linda Santilli',
    lastName: 'Taylor',
    phone: '+15412809903',
    email: 'guidosgirl4@msn.com',
    badgeId: '100000026',
  },
  {
    firstName: 'Liz',
    lastName: 'Skarvelis',
    phone: '+15416395989',
    email: 'skarvelisliz@gmail.com',
    badgeId: '100000233',
  },
  {
    firstName: 'Marisa',
    lastName: 'Funk',
    phone: '',
    email: 'marisacfunk@gmail.com',
    badgeId: '100000288',
  },
  {
    firstName: 'Nancy',
    lastName: 'Lumpkin',
    phone: '+15414208281',
    email: 'nlumpkin@bendbroadband.com',
    badgeId: '100000005',
  },
  {
    firstName: 'Nora',
    lastName: 'Smith',
    phone: '+15416102006',
    email: 'norathenora@gmail.com',
    badgeId: '100000062',
  },
  {
    firstName: 'Pam',
    lastName: 'Hardy',
    phone: '+15419149698',
    email: 'rivergirl212@gmail.com',
    badgeId: '100000028',
  },
  {
    firstName: 'Patrick',
    lastName: 'Kincart',
    phone: '+15413504374',
    email: 'bendbodyworks@gmail.com',
    badgeId: '100000013',
  },
  {
    firstName: 'Patty',
    lastName: 'Walker',
    phone: '+18083449313',
    email: 'pwalker1374@gmail.com',
    badgeId: '100000249',
  },
  {
    firstName: 'Pearl',
    lastName: 'Stark',
    phone: '+15413188997',
    email: 'pkstark@gmail.com',
    badgeId: '100000035',
  },
  {
    firstName: 'Pete',
    lastName: 'Pennington',
    phone: '',
    email: 'pete@namaspa.com',
    badgeId: '100000173',
  },
  {
    firstName: 'Petit',
    lastName: 'Pinson',
    phone: '+15599430008',
    email: 'petitdavina@yahoo.com',
    badgeId: '100000084',
  },
  {
    firstName: 'PJ',
    lastName: 'Fritchman',
    phone: '+15419481690',
    email: 'fritchp@yahoo.com',
    badgeId: '100000251',
  },
  {
    firstName: 'Sebastian',
    lastName: 'Prenger',
    phone: '',
    email: 'sebastianprenger@hotmai.com',
  },
  {
    firstName: 'Sharon',
    lastName: 'Page',
    phone: '+15412040871',
    email: 'sharonp@mukhayoga.com',
    badgeId: '100000048',
  },
  {
    firstName: 'Stacy',
    lastName: 'Davis',
    phone: '',
    email: 'stacy.nelson.davis@gmail.com',
    badgeId: '100000253',
  },
  {
    firstName: 'Stephanie',
    lastName: 'Hutto',
    phone: '+15412315619',
    email: 'stephanie.hutto@gmail.com',
    badgeId: '100000200',
  },
  {
    firstName: 'Suzie',
    lastName: 'Newcome',
    phone: '+15412410270',
    email: 'suzie@namaspa.com',
    badgeId: '100000001',
  },
  {
    firstName: 'Suzy',
    lastName: 'Aragon',
    phone: '+15412801193',
    email: 'suzybb1103@yahoo.com',
    badgeId: '100000300',
  },
  {
    firstName: 'Symeon',
    lastName: 'North',
    phone: '+15416470608',
    email: 'symeon.north@gmail.com',
    badgeId: '100000284',
  },
  {
    firstName: 'Tami',
    lastName: 'Taylor',
    phone: '',
    email: 'raenicoll@yahoo.com',
    badgeId: '100000103',
  },
  {
    firstName: 'Tiana',
    lastName: 'Marie',
    phone: '+15416478602',
    email: '31tmarie@gmail.com',
  },
  {
    firstName: 'Josh',
    lastName: 'Garner',
    phone: '+15413908765',
    email: 'josh.garner.dev@gmail.com',
    badgeId: '100000290',
  },
];

exports.seedTeachers = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('seedTeachers');
  let params;
  let filterParams;
  await teachers.forEach(async teacher => {
    console.log('teacherEmail', teacher.email);

    params = {
      UserPoolId: 'us-west-2_PsG59UC2E',
      Username: teacher.email,
      DesiredDeliveryMediums: ['EMAIL'],
      ForceAliasCreation: false,
      MessageAction: 'SUPPRESS',
      TemporaryPassword: 'namaspa1',
      UserAttributes: [
        {
          Name: 'email',
          Value: teacher.email,
        },
        {
          Name: 'name',
          Value: teacher.firstName,
        },
        {
          Name: 'family_name',
          Value: teacher.lastName,
        },
        {
          Name: 'phone_number',
          Value: teacher.phone,
        },
        {
          Name: 'custom:badge_id',
          Value: teacher.badgeId,
        },
      ],
      ValidationData: [],
    };
    await cognitoIdentityService
      .adminCreateUser(params)
      .promise()
      .then(async data => {
        const user = dig(data, 'User');
        createLocalUser(user);
        await addUserToTeachers(user);
      })
      .catch(err => console.error(err.code));
  });
  await teachers.forEach(async teacher => {
    filterParams = {
      UserPoolId: 'us-west-2_PsG59UC2E',
      Filter: `email = "${teacher.email}"`,
    };
    await cognitoIdentityService
      .listUsers(filterParams)
      .promise()
      .then(data => {
        const user = dig(data, 'Users', 0);
        console.log('user: ', user);
        createLocalUser(user);
      })
      .catch(err => console.error('err:', err.code));
  });
  callback(null, respSuccess({ status: 'done' }));
};
