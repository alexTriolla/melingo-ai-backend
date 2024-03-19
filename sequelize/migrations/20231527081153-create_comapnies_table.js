'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      businessName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isEmail: true },
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fax: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      displayLinks: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      linkWithPicture: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      chatbotPosition: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      chatbotName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      chatbotSubtitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      themeColor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fontColor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      buttonColor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      backgroundPattern: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });


  },

  async down(queryInterface) {


    await queryInterface.dropTable('companies');
  },
};
