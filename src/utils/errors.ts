export enum ErrorCode {
  SUBSCRIPTION_CONFIG_FAILED = 'SUBSCRIPTION_CONFIG_FAILED',
  PURCHASE_FAILED = 'PURCHASE_FAILED',
  PURCHASE_CANCELLED = 'PURCHASE_CANCELLED',
  RESTORE_FAILED = 'RESTORE_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
}

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly recoverable: boolean = false,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class SubscriptionError extends AppError {
  constructor(
    message: string,
    code: ErrorCode,
    recoverable: boolean = false,
    originalError?: unknown
  ) {
    super(message, code, recoverable, originalError);
    this.name = 'SubscriptionError';
    Object.setPrototypeOf(this, SubscriptionError.prototype);
  }
}

export class StorageError extends AppError {
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.STORAGE_ERROR,
    recoverable: boolean = true,
    originalError?: unknown
  ) {
    super(message, code, recoverable, originalError);
    this.name = 'StorageError';
    Object.setPrototypeOf(this, StorageError.prototype);
  }
}
