import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { UserModel } from './user.model';
import { Company } from '@app/types';

/**
 * Represents a Company model in the database.
 */
@Table({
  tableName: 'companies',
})
export class CompanyModel extends Model<Company> {
  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  businessName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { isEmail: true },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true, // Assuming phone is optional
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true, // Assuming fax is optional
  })
  fax: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  displayLinks: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  linkWithPicture: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  chatbotPosition: string; // "left" or "right"

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  chatbotName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  chatbotSubtitle: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ }, // Hex color validation
  })
  themeColor: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ }, // Hex color validation
  })
  fontColor: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ }, // Hex color validation
  })
  buttonColor: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  backgroundPattern: string; // Can be hex color or URL to an S3 object

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  logo: string; // URL to an S3 object

  @Column(DataType.BOOLEAN)
  chatMode: boolean;

  @Column(DataType.STRING)
  language: string;

  @Column(DataType.STRING)
  dataFolder: string;

  // Assuming simple_directory_args is a JSON object
  @Column(DataType.JSONB)
  simpleDirectoryArgs: object;

  @Column(DataType.STRING)
  promptFile: string;

  @Column(DataType.STRING)
  instructionFile: string;

  @Column(DataType.STRING)
  toolsFile: string;

  @Column(DataType.STRING)
  classificationPrompt: string;

  @Column(DataType.STRING)
  dbType: string;

  // Assuming db_args is a nested JSON object, including nested db_args
  @Column(DataType.JSONB)
  dbArgs: object;

  @Column(DataType.STRING)
  chatStoreType: string;

  // Assuming chat_store_args is a JSON object
  @Column(DataType.JSONB)
  chatStoreArgs: object;

  @Column(DataType.STRING)
  filePreprocessFunctions: string;

  @Column(DataType.STRING)
  llmProvider: string;

  @Column(DataType.STRING)
  llm: string;

  // Assuming llm_kwargs is a JSON object
  @Column(DataType.JSONB)
  llmKwargs: object;

  @Column(DataType.INTEGER)
  chunkSize: number;

  @Column(DataType.INTEGER)
  chunkOverlap: number;

  @Column(DataType.STRING)
  embedModelName: string;

  @Column(DataType.INTEGER)
  topk: number;

  @Column(DataType.BOOLEAN)
  useClassification: boolean;

  // Assuming nodes_postprocessors is a JSON object
  @Column(DataType.JSONB)
  nodesPostprocessors: object;

  @Column(DataType.STRING)
  spacyModelName: string;

  @Column(DataType.STRING)
  offensiveFilePath: string;

  @Column(DataType.STRING)
  filePostprocessFunctions: string;

  // Assuming response_postprocessors is a JSON object
  @Column(DataType.JSONB)
  responsePostprocessors: object;

  @Column(DataType.STRING)
  pathPhrasesToRemove: string;

  // Assuming doc_function_processing is a JSON object
  @Column(DataType.JSONB)
  docFunctionProcessing: object;

  @Column(DataType.BOOLEAN)
  pdfPaginated: boolean;

  @Column(DataType.BOOLEAN)
  deletePdf: boolean;

  @Column(DataType.STRING)
  pdfOutputFormat: string;

  // Assuming pandas_reader_args is a JSON object
  @Column(DataType.JSONB)
  pandasReaderArgs: object;

  // Assuming filters is an array or JSON object
  @Column(DataType.JSONB)
  filters: Array<any>;

  @Column(DataType.STRING)
  ragPrompt: string;

  @Column(DataType.STRING)
  systemPrompt: string;

  @Column(DataType.STRING)
  toolRagDescription: string;

  // Assuming cache is a JSON object
  @Column(DataType.JSONB)
  cache: object;

  @Column(DataType.BOOLEAN)
  useLlmNerExtractor: boolean;

  @Column(DataType.STRING)
  nerDomain: string;

  // Assuming pandas_kwargs is a JSON object
  @Column(DataType.JSONB)
  pandasKwargs: object;

  // Assuming ner_entities is an array or JSON object
  @Column(DataType.JSONB)
  nerEntities: Array<string>;

  @Column(DataType.BOOLEAN)
  resetChatEveryCall: boolean;

  // Assuming morfix_insights is a JSON object
  @Column(DataType.JSONB)
  morfixInsights: object;

  @HasMany(() => UserModel)
  users: UserModel[];
}
