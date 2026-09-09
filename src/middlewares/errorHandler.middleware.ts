import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

/**
 * Middleware para rutas no encontradas (404).
 * Se registra después de todas las rutas válidas.
 */
export function rutaNoEncontrada(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      mensaje: `La ruta ${req.method} ${req.originalUrl} no existe`,
      requestId: req.requestId,
    },
  });
}

/**
 * Middleware centralizado de manejo de errores.
 * Debe registrarse al final de la cadena de middlewares (con 4 parámetros
 * para que Express lo reconozca como error handler).
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const requestId = req.requestId;

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        mensaje: err.message,
        detalles: err.details,
        requestId,
      },
    });
    return;
  }

  if (esErrorDeJsonInvalido(err)) {
    res.status(400).json({
      error: {
        mensaje: "El cuerpo de la solicitud no es un JSON válido",
        requestId,
      },
    });
    return;
  }

  // Error inesperado: no se filtran detalles internos al cliente.
  console.error(`[${requestId}] Error no controlado:`, err);
  res.status(500).json({
    error: {
      mensaje: "Ocurrió un error interno en el servidor",
      requestId,
    },
  });
}

function esErrorDeJsonInvalido(err: unknown): boolean {
  if (!err || typeof err !== "object") {
    return false;
  }

  const error = err as { type?: string };
  return error.type === "entity.parse.failed";
}
