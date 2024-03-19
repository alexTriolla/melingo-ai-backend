export const configuration = () => ({
  development: process.env.NODE_ENV === 'development',
  port: parseInt(process.env.PORT) || 3000,
  apiVersion: parseInt(process.env.API_VERSION) || 1,
  cognitoRegion: process.env.COGNITO_REGION,
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  clientId: process.env.COGNITO_CLIENT_ID,
  databaseUrl: process.env.DATABASE_URL,
});
