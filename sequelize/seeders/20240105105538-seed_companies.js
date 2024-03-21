'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Array of companies to seed
    const companiesToSeed = [
      {
        businessName: 'Example Company',
        email: 'contact@example.com',
        phone: '123-456-7890',
        fax: '123-456-7891',
        displayLinks: true,
        linkWithPicture: true,
        chatbotPosition: 'right',
        chatbotName: 'ExampleBot',
        chatbotSubtitle: 'Your friendly assistant',
        themeColor: '#0000FF', // Blue
        fontColor: '#FFFFFF', // White
        buttonColor: '#FF0000', // Red
        backgroundPattern: 'https://example.com/background.png',
        logo: 'https://example.com/logo.png',
        chatMode: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more company objects here if needed
    ];

    await queryInterface.bulkInsert('companies', companiesToSeed);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('companies', null, {});
  },
};
