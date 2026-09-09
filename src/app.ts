import path from "path";
import express, { Application } from "express";
import apiRoutes from "./routes";
import { requestIdMiddleware } from "./middlewares/requestId.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import {
  errorHandler,
  rutaNoEncontrada,
} from "./middlewares/errorHandler.middleware";

const app: Application = express();
const publicDir = path.join(__dirname, "..", "public");

app.use(requestIdMiddleware);
app.use(express.json());
app.use(loggerMiddleware);

app.use("/api", apiRoutes);
app.use(express.static(publicDir));

// SPA: el frontend navega sin recargar; cualquier GET que no sea /api
// recibe index.html para que el router del cliente pinte la vista.
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api")) {
    next();
    return;
  }

  res.sendFile(path.join(publicDir, "index.html"));
});

app.use(rutaNoEncontrada);
app.use(errorHandler);

export default app;
