import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

const TIPOS_PANEL_VALIDOS = ["IPS", "VA", "TN", "OLED"];

interface ErrorCampo {
  campo: string;
  mensaje: string;
}

/**
 * Valida el body para la creación de un monitor (POST).
 * Todos los campos son obligatorios.
 */
export function validarCrearMonitor(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const errores = validarCampos(req.body, { requerirTodos: true });
  if (errores.length > 0) {
    return next(
      new AppError("Datos de monitor inválidos", 422, errores)
    );
  }
  next();
}

/**
 * Valida el body para la actualización de un monitor (PUT/PATCH).
 * Los campos son opcionales, pero si están presentes deben ser válidos,
 * y el body no puede estar vacío.
 */
export function validarActualizarMonitor(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(
      new AppError("El cuerpo de la solicitud no puede estar vacío", 422)
    );
  }

  const errores = validarCampos(req.body, { requerirTodos: false });
  if (errores.length > 0) {
    return next(
      new AppError("Datos de monitor inválidos", 422, errores)
    );
  }
  next();
}

/**
 * Valida que el parámetro :id de la ruta sea un entero positivo.
 */
export function validarIdParam(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(
      new AppError(
        `El parámetro id debe ser un entero positivo, se recibió "${req.params.id}"`,
        400
      )
    );
  }
  next();
}

function validarCampos(
  body: Record<string, unknown>,
  opciones: { requerirTodos: boolean }
): ErrorCampo[] {
  const errores: ErrorCampo[] = [];
  const campos: Array<keyof typeof reglas> = [
    "marca",
    "modelo",
    "tamanoPantalla",
    "tasaRefresco",
    "resolucion",
    "tipoPanel",
    "precio",
  ];

  const reglas = {
    marca: (v: unknown) => typeof v === "string" && v.trim().length > 0,
    modelo: (v: unknown) => typeof v === "string" && v.trim().length > 0,
    tamanoPantalla: (v: unknown) => typeof v === "number" && v > 0,
    tasaRefresco: (v: unknown) => typeof v === "number" && v > 0,
    resolucion: (v: unknown) =>
      typeof v === "string" && /^\d+x\d+$/.test(v.trim()),
    tipoPanel: (v: unknown) =>
      typeof v === "string" && TIPOS_PANEL_VALIDOS.includes(v),
    precio: (v: unknown) => typeof v === "number" && v >= 0,
  };

  for (const campo of campos) {
    const valor = body[campo];
    const presente = valor !== undefined && valor !== null;

    if (!presente) {
      if (opciones.requerirTodos) {
        errores.push({ campo, mensaje: "Este campo es obligatorio" });
      }
      continue;
    }

    if (!reglas[campo](valor)) {
      errores.push({
        campo,
        mensaje: mensajeError(campo),
      });
    }
  }

  if (body.imagen !== undefined && body.imagen !== null && body.imagen !== "") {
    if (typeof body.imagen !== "string" || !esImagenValida(body.imagen)) {
      errores.push({
        campo: "imagen",
        mensaje: "Debe ser una ruta local (/images/...) o una URL http(s)",
      });
    }
  }

  return errores;
}

function esImagenValida(valor: string): boolean {
  const texto = valor.trim();
  return texto.startsWith("/") || /^https?:\/\//i.test(texto);
}

function mensajeError(campo: string): string {
  switch (campo) {
    case "marca":
    case "modelo":
      return "Debe ser un texto no vacío";
    case "tamanoPantalla":
    case "tasaRefresco":
      return "Debe ser un número mayor a 0";
    case "resolucion":
      return 'Debe tener el formato "ANCHOxALTO", ej. "1920x1080"';
    case "tipoPanel":
      return `Debe ser uno de: ${TIPOS_PANEL_VALIDOS.join(", ")}`;
    case "precio":
      return "Debe ser un número mayor o igual a 0";
    default:
      return "Valor inválido";
  }
}
