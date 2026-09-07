import { NextFunction, Request, Response } from "express";
import { monitorService } from "../services/monitor.service";
import { CrearMonitorDTO, ActualizarMonitorDTO } from "../models/monitor.model";

/**
 * GET /api/monitores
 * Soporta filtros opcionales vía query string: ?tipoPanel=OLED&marca=lg
 */
function listar(req: Request, res: Response, next: NextFunction): void {
  try {
    const { tipoPanel, marca } = req.query;
    const monitores = monitorService.listar({
      tipoPanel: typeof tipoPanel === "string" ? tipoPanel : undefined,
      marca: typeof marca === "string" ? marca : undefined,
    });
    res.status(200).json({ total: monitores.length, data: monitores });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/monitores/:id
 */
function obtenerPorId(req: Request, res: Response, next: NextFunction): void {
  try {
    const id = Number(req.params.id);
    const monitor = monitorService.obtenerPorId(id);
    res.status(200).json({ data: monitor });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/monitores
 */
function crear(req: Request, res: Response, next: NextFunction): void {
  try {
    const dto = req.body as CrearMonitorDTO;
    const nuevoMonitor = monitorService.crear(dto);
    res.status(201).json({ data: nuevoMonitor });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/monitores/:id
 * PATCH /api/monitores/:id
 */
function actualizar(req: Request, res: Response, next: NextFunction): void {
  try {
    const id = Number(req.params.id);
    const dto = req.body as ActualizarMonitorDTO;
    const monitorActualizado = monitorService.actualizar(id, dto);
    res.status(200).json({ data: monitorActualizado });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/monitores/:id
 */
function eliminar(req: Request, res: Response, next: NextFunction): void {
  try {
    const id = Number(req.params.id);
    monitorService.eliminar(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export const monitorController = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
