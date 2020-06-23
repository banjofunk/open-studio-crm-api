

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Organizations', [
      {
        id: 1,
        name: 'Namaspa',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]),

  down: () => Promise.resolve()
};
