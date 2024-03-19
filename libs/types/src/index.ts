export * from './auth';
export * from './user';
export * from './company';

export type BaseResponse<T> = T & {
  message?: string;
  messageType?: 'success' | 'error';
  statusCode?: string;
};
