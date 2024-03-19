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
      chatMode: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dataFolder: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      simpleDirectoryArgs: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      promptFile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      instructionFile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      toolsFile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      classificationPrompt: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dbType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dbArgs: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      chatStoreType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      chatStoreArgs: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      filePreprocessFunctions: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      llmProvider: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      llm: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      llmKwargs: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      chunkSize: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      chunkOverlap: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      embedModelName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      topk: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      useClassification: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      nodesPostprocessors: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      spacyModelName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      offensiveFilePath: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      filePostprocessFunctions: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      responsePostprocessors: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      pathPhrasesToRemove: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      docFunctionProcessing: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      pdfPaginated: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      deletePdf: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      pdfOutputFormat: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pandasReaderArgs: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      filters: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      ragPrompt: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      systemPrompt: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      toolRagDescription: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cache: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      useLlmNerExtractor: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      nerDomain: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pandasKwargs: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      nerEntities: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      resetChatEveryCall: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      morfixInsights: {
        type: Sequelize.JSONB,
        allowNull: true,
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
