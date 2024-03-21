'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Specific user details
    const specificUser = [
      {
        sub: faker.datatype.uuid(),
        companyId: 1,
        role: 'Admin',
        email: 'nimrod+12@triolla.io',
        email_verified: true,
        name: 'Alex',
        lastName: 'Lazarovich',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Generate an array of 1000 fake users
    const fakeUsers = Array.from({ length: 1000 }).map(() => ({
      sub: faker.datatype.uuid(),
      companyId: faker.datatype.number({ min: 2, max: 10 }), // Assuming other companies exist
      role: faker.helpers.arrayElement(['translator', 'reviewer', 'editor']), // Removed 'admin' from the faker roles
      email: faker.internet.email(),
      email_verified: faker.datatype.boolean(),
      name: faker.name.firstName(),
      lastName: faker.name.lastName(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Combine specific user with fake users
    const users = [...specificUser, ...fakeUsers];

    await queryInterface.bulkInsert('users', specificUser);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
