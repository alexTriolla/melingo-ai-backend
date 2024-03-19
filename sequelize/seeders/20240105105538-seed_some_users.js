'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Generate an array of 1000 fake users

    const fakeUsers = Array.from({ length: 1000 }).map(() => {
      const user = {
        sub: faker.string.uuid(),
        email: faker.internet.email(),
        email_verified: true,
        fullName: faker.person.fullName(),
        group: faker.helpers.arrayElement(['admin', 'translator', 'reviewer', 'editor']),
      };

      if (user.group === 'translator') {
        user.translateTo = faker.helpers.arrayElements(['es', 'pt', 'he', 'ar'], 2).toString();
      }

      return user;
    });

    await queryInterface.bulkInsert('users', fakeUsers);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
