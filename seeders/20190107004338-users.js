
module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [{
    id: 1,
    organizationId:1,
    cognitoId: '3c368c7d-0714-4ca2-b1ec-7162901fbcd7',
    badgeId: '123123',
    firstName: 'josh',
    lastName: 'garner',
    email: 'josh.garner.dev@gmail.com',
    roles: JSON.stringify(['teacher']),
    createdAt: new Date(),
    updatedAt: new Date()
  }]),
  down: () => Promise.resolve()
};
