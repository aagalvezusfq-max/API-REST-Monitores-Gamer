import { Router } from "express";
import { monitorController } from "../controllers/monitor.controller";
import {
  validarCrearMonitor,
  validarActualizarMonitor,
  validarIdParam,
} from "../middlewares/validarMonitor.middleware";

const router = Router();

// GET /api/monitores - lista todos los monitores (con filtros opcionales)
router.get("/", monitorController.listar);

// GET /api/monitores/:id - obtiene un monitor específico
router.get("/:id", validarIdParam, monitorController.obtenerPorId);

// POST /api/monitores - crea un nuevo monitor
router.post("/", validarCrearMonitor, monitorController.crear);

// PUT /api/monitores/:id - reemplaza/actualiza un monitor existente
router.put(
  "/:id",
  validarIdParam,
  validarActualizarMonitor,
  monitorController.actualizar
);

// PATCH /api/monitores/:id - actualiza parcialmente un monitor existente
router.patch(
  "/:id",
  validarIdParam,
  validarActualizarMonitor,
  monitorController.actualizar
);

// DELETE /api/monitores/:id - elimina un monitor
router.delete("/:id", validarIdParam, monitorController.eliminar);

export default router;
