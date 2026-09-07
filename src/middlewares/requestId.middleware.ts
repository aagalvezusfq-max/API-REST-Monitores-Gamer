import { randomUUID } from "crypto";
import { NextFunction, Request, Response } from "express";

// Extiende el tipo Request de Express para incluir el requestId.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}

/**
 * Genera un identificador único por cada solicitud entrante y lo expone en:
 * - req.requestId, para que otros middlewares/controladores lo usen.
 * - el header de respuesta X-Request-Id, para que el cliente pueda rastrearla.
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const incomingId = req.header("X-Request-Id");
  req.requestId = incomingId ?? randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
}
