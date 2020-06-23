module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Locations', [
      {
        id: 1,
        organizationId: 1,
        name: 'Bend',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        organizationId: 1,
        name: 'Redmond',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]),

  down: () => Promise.resolve()
};
