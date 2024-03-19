'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sub: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      // Adding companyId as a foreign key to users table
      companyId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'companies', // name of the Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true, // Allows null if you want optional relation
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
        validate: {
          isEmail: true,
        },
      },
      email_verified: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      usageLimitation: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      datasetName: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      welcomeEn: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: false,
      },
      welcomeHe: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: false,
      },
      lastLoginDate: {
        allowNull: true,
        type: Sequelize.DATE,
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

    await queryInterface.addIndex('users', ['role']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('users', ['role']);

    await queryInterface.dropTable('users');
  },
};
