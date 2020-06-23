import {
  ClassEvent,
  ClassEventUser,
  User,
  Room,
  Location,
  ClassType,
} from 'models';
import { respSuccess, respServerError } from './utils/callbackResponses';

exports.create = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { classEvent, user } = JSON.parse(event.body);
  const classEventUser = {
    userId: user.id,
    ClassEventId: classEvent.id,
  };
  console.log('user:', user);
  console.log('classEvent:', classEvent);
  console.log('classEventUser', classEventUser);
  ClassEventUser.create(classEventUser)
    .then(() => {
      ClassEvent.findById(classEvent.id, {
        include: [
          {
            model: Room,
            as: 'room',
            where: {},
            include: {
              model: Location,
              as: 'location',
              attributes: ['id', 'name'],
            },
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'teacher',
          },
          {
            model: ClassType,
            as: 'classType',
          },
          {
            model: User,
            as: 'students',
          },
        ],
      }).then(respClassEvent => callback(null, respSuccess(respClassEvent)));
    })
    .catch(err => callback(null, respServerError(err)));
};

exports.delete = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { classEvent, user } = JSON.parse(event.body);
  ClassEventUser.destroy({
    where: { userId: user.id, classEventId: classEvent.id },
  }).then(() => {
    ClassEvent.findById(classEvent.id, {
      include: [
        {
          model: Room,
          as: 'room',
          where: {},
          include: {
            model: Location,
            as: 'location',
            attributes: ['id', 'name'],
          },
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'teacher',
        },
        {
          model: ClassType,
          as: 'classType',
        },
        {
          model: User,
          as: 'students',
        },
      ],
    }).then(respClassEvent => callback(null, respSuccess(respClassEvent)));
  });
};
