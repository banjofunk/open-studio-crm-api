import AWS from 'aws-sdk';
import { ClassType, Location, Room, StaffMember, User } from 'models';
import { dig } from 'functions/utils';
import moment from 'moment-timezone';

const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-west-2',
  convertEmptyValues: true,
});

const ClassEventParser = async dbClassEvent => {
  const classEvent = { ...dbClassEvent };
  classEvent.students = dbClassEvent.students.length;
  const classTime = `${dbClassEvent.classDate} ${dbClassEvent.startTime}`;
  const ClassDate = moment(classTime, 'M/DD/YYYY h:mm:ss a').format(
    'YYYY-MM-DDTHH:mm:ss'
  );

  const classTypeMindbodyId =
    dig(dbClassEvent, 'classTypeId', id => parseInt(id)) || 0;
  const rawClassType =
    (await ClassType.find({
      raw: true,
      where: { mindbodyId: classTypeMindbodyId },
    })) || {};
  const classType = { ...rawClassType };
  delete classType.description;

  const teacherMindbodyId =
    dig(dbClassEvent, 'teacherId', id => parseInt(id)) || 0;
  const rawTeacher =
    (await StaffMember.find({
      raw: true,
      where: { mindbodyId: teacherMindbodyId },
    })) || {};
  const teacher = { ...rawTeacher };
  delete teacher.description;
  delete teacher.payRates;
  delete teacher.appointmentPayRates;
  console.log('teacher', teacher);

  const resourceMindbodyId =
    dig(dbClassEvent, 'resourceId', id => parseInt(id)) || 0;
  const room = await Room.find({
    raw: true,
    where: { mindbodyId: resourceMindbodyId },
    include: [{ model: Location, as: 'location' }],
  });

  const payRate =
    dig(rawTeacher, 'payRates', 'classRates', rates =>
      rates.find(rate => {
        const dbRate = dig(dbClassEvent, 'rate', ce =>
          ce.replace(new RegExp(decodeURI('%C2%A0'), 'g'), ' ')
        );
        return dbRate === rate.name;
      })
    ) || {};

  const students = [
    {
      ...classEvent,
      organizationId: 1,
      classType,
      room,
      teacher,
      ClassDate,
      StudentId: 0,
      TeacherId: dig(teacher, 'id') || 0,
      ClassTypeId: dig(classType, 'id') || 0,
      student: {},
      payRate,
    },
  ];
  await Promise.all(
    dbClassEvent.students.map(student => {
      const studentMindbodyId = dig(student, 'id', id => parseInt(id)) || 0;
      return User.find({
        raw: true,
        where: { mindbodyId: studentMindbodyId },
      }).then(newStudent => {
        students.push({
          ...classEvent,
          organizationId: 1,
          classType,
          room,
          teacher,
          ClassDate,
          StudentId: dig(newStudent, 'id') || 0,
          TeacherId: dig(teacher, 'id') || 0,
          ClassTypeId: dig(classType, 'id') || 0,
          student: newStudent,
          payment: student,
          payRate,
        });
      });
    })
  );

  console.log('students count:', students.length);

  await Promise.all(
    students.map(student => {
      const { ClassTypeId, StudentId } = student;
      const ClassId = `${ClassTypeId}_${StudentId}`;
      delete student.teacherId;
      delete student.classTypeId;
      delete student.ClassDate;
      const attributeUpdates = Object.assign(
        ...Object.entries({ ...student }).map(ob => ({
          [ob[0]]: { Action: 'PUT', Value: ob[1] },
        }))
      );
      const dynamoParams = {
        Key: { ClassId, ClassDate },
        AttributeUpdates: attributeUpdates,
        TableName: `my-studio-${process.env.STAGE}-ClassEventStudentsTable`,
      };
      return documentClient
        .update(dynamoParams)
        .promise()
        .catch(err => console.log('err', attributeUpdates, err, student));
    })
  );
  return Promise.resolve();
};

export default ClassEventParser;
