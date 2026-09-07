import express, { Application } from "express";
import apiRoutes from "./routes";
import { requestIdMiddleware } from "./middlewares/requestId.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import {
  errorHandler,
  rutaNoEncontrada,
} from "./middlewares/errorHandler.middleware";

const app: Application = express();

// Middlewares globales (orden importa: requestId antes que logger).
app.use(express.json());
app.use(requestIdMiddleware);
app.use(loggerMiddleware);

// Rutas principales de la API.
app.use("/api", apiRoutes);

// 404 para rutas no definidas.
app.use(rutaNoEncontrada);

// Middleware centralizado de errores (siempre al final).
app.use(errorHandler);

export default app;
