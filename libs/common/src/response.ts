export class ServiceResponse<T> {
  data: T | boolean;
  statusCode: number;
  error: any;
  message?: string;
  messageType?: 'success' | 'error';
  toastMessage?: string;

  constructor(data: T, statusCode = 200, error: any = null) {
    this.data = data;
    this.statusCode = statusCode;
    this.error = error;

    if (data?.['message']) {
      this.message = data['message'];

      delete data['message'];
    }

    if (data?.['messageType']) {
      this.messageType = data['messageType'];

      delete data['messageType'];
    }

    if (data?.['toastMessage']) {
      this.toastMessage = data['toastMessage'];

      delete data['toastMessage'];
    }

    if (!Object.keys(this.data).length) {
      this.data = true;
    }
  }

  static createErrorResponse(statusCode = 400, error: any) {
    const serviceResponse = new ServiceResponse(null, statusCode, error);
    return serviceResponse;
  }

  isSuccess() {
    return this.statusCode >= 200 && this.statusCode < 300;
  }
}
