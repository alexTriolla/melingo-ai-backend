export enum DatabaseErrors {
  USER_EXISTS = 'UserAlreadyExists',
  FAILED_CREATE_COGNITO = 'FailedToCreateCognitoUser',
  FAILED_UPDATE_COGNITO = 'FailedToUpdateCognitoUser',
  FAILED_DELETE_COGNITO = 'FailedToDeleteCognitoUser',
  USER_NOT_FOUND = 'UserNotFound',
}
