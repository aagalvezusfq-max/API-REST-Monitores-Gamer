import { NextFunction, Request, Response } from "express";

/**
 * Middleware de logging (auditoría básica de tráfico).
 * Registra método, ruta, requestId, código de estado y duración
 * de cada solicitud procesada por la API.
 */
export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const inicio = process.hrtime.bigint();

  res.on("finish", () => {
    const fin = process.hrtime.bigint();
    const duracionMs = Number(fin - inicio) / 1_000_000;
    const timestamp = new Date().toISOString();

    console.log(
      `[${timestamp}] [${req.requestId}] ${req.method} ${req.originalUrl} ` +
        `-> ${res.statusCode} (${duracionMs.toFixed(2)}ms)`
    );
  });

  next();
}
