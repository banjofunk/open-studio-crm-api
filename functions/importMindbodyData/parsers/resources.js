/* eslint-disable no-restricted-syntax */
import AWS from 'aws-sdk';
import { VisitType, Room, RoomVisitType } from 'models';

const documentClient = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

const resourcesParser = async () => {
  let params = {
    TableName: 'ServiceCategoryVisitTypesTable',
  };
  const dbVisitTypes = await documentClient
    .scan(params)
    .promise()
    .then(data => data.Items);
  const visitTypes = dbVisitTypes.map(dbVisitType => ({
    organizationId: 1,
    mbId: dbVisitType.id,
    category: dbVisitType.ServiceCategoryName,
    name: dbVisitType.VisitTypeName,
    displayName: dbVisitType.DisplayName,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  const newVisitTypes = await VisitType.bulkCreate(visitTypes).then(() =>
    VisitType.findAll()
  );
  const visitTypeMap = {};
  for (const [i, vt] of visitTypes.entries()) {
    visitTypeMap[vt.mbId] = newVisitTypes[i].id;
  }

  params = {
    TableName: 'ResourcesTable',
  };
  const dbResources = await documentClient
    .scan(params)
    .promise()
    .then(data => data.Items);
  const resources = dbResources.map(dbResource => ({
    name: dbResource.Name,
    visitTypes: dbResource.AllowedVisitTypeIds,
    organizationId: 1,
    mindbodyId: dbResource.id,
    locationId: dbResource.LocationId,
    acceptsClasses: dbResource.AcceptsClasses,
    acceptsAppointments: dbResource.AcceptsAppointments,
    acceptsEnrollments: dbResource.AcceptsEnrollments,
    hasSchedules: dbResource.HasSchedules,
    active: dbResource.Active,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  const rooms = await Room.bulkCreate(resources).then(() => Room.findAll());
  const resourceVisitTypes = [];

  for (const [i, resource] of resources.entries()) {
    console.log(resource.name, rooms[i].name);
    const roomId = rooms[i].id;
    for (const vtId of resource.visitTypes) {
      const visitTypeId = visitTypeMap[vtId];
      if (visitTypeId && roomId) {
        resourceVisitTypes.push({
          roomId,
          visitTypeId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  }

  const roomVisitTypes = await RoomVisitType.bulkCreate(
    resourceVisitTypes
  ).then(() => RoomVisitType.findAll());

  console.log(roomVisitTypes.map(rvt => `${rvt.roomId} - ${rvt.visitTypeId}`));
  return true;
};

export default resourcesParser;
