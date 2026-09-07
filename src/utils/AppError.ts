/**
 * Error de aplicación con código de estado HTTP asociado.
 * Permite que el middleware centralizado de errores responda
 * de forma consistente ante situaciones de negocio esperadas
 * (recurso no encontrado, validación fallida, etc).
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
