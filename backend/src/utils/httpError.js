export const createHttpError = (statusCode, message, details) =>
  Object.assign(new Error(message), { statusCode, details });
