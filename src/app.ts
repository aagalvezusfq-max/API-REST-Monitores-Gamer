import express, { Application } from "express";
import apiRoutes from "./routes";
import { requestIdMiddleware } from "./middlewares/requestId.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import {
  errorHandler,
  rutaNoEncontrada,
} from "./middlewares/errorHandler.middleware";
import { apiInfo, renderPortadaHtml } from "./views/portada";

const app: Application = express();

// Middlewares globales (orden importa: requestId antes del parser JSON
// para que incluso un body inválido lleve X-Request-Id).
app.use(requestIdMiddleware);
app.use(express.json());
app.use(loggerMiddleware);

// Portada: HTML en el navegador, JSON para clientes API (curl, fetch, Postman).
app.get("/", (req, res) => {
  if (req.accepts(["json", "html"]) === "html") {
    res.status(200).type("html").send(renderPortadaHtml());
    return;
  }

  res.status(200).json(apiInfo);
});

// Rutas principales de la API.
app.use("/api", apiRoutes);

// 404 para rutas no definidas.
app.use(rutaNoEncontrada);

// Middleware centralizado de errores (siempre al final).
app.use(errorHandler);

export default app;
