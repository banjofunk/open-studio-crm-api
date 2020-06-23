/* eslint-disable consistent-return */
module.exports = (resource, logicalId) => {
  console.log('logicalId', logicalId)
  if (logicalId.startsWith("ClassEvent")) return { destination: 'ClassEvent' };
  if (logicalId.startsWith("ClassType")) return { destination: 'ClassType' };
  if (logicalId.startsWith("Import")) return { destination: 'Import' };
  if (logicalId.startsWith("Location")) return { destination: 'Location' };
  if (logicalId.startsWith("Organization")) return { destination: 'Organization' };
  if (logicalId.startsWith("Product")) return { destination: 'Product' };
  if (logicalId.startsWith("Room")) return { destination: 'Room' };
  if (logicalId.startsWith("StaffMember")) return { destination: 'StaffMember' };
  if (logicalId.startsWith("User")) return { destination: 'User' };

  // Falls back to default
};
