import { AppError } from "../utils/AppError";
import {
  ActualizarMonitorDTO,
  CrearMonitorDTO,
  Monitor,
} from "../models/monitor.model";

/**
 * "Base de datos" en memoria. Se reinicia cada vez que el proceso se reinicia.
 */
let monitores: Monitor[] = [
  {
    id: 1,
    marca: "ASUS",
    modelo: "ROG Swift PG27AQN",
    tamanoPantalla: 27,
    tasaRefresco: 360,
    resolucion: "2560x1440",
    tipoPanel: "IPS",
    precio: 899.99,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
  {
    id: 2,
    marca: "Samsung",
    modelo: "Odyssey G9",
    tamanoPantalla: 49,
    tasaRefresco: 240,
    resolucion: "5120x1440",
    tipoPanel: "VA",
    precio: 1299.0,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
  {
    id: 3,
    marca: "LG",
    modelo: "UltraGear 27GR95QE",
    tamanoPantalla: 27,
    tasaRefresco: 240,
    resolucion: "2560x1440",
    tipoPanel: "OLED",
    precio: 999.99,
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
];

let siguienteId = 4;

/**
 * Devuelve todos los monitores registrados.
 * Soporta filtrado opcional por tipoPanel y marca (query params).
 */
function listar(filtros?: { tipoPanel?: string; marca?: string }): Monitor[] {
  let resultado = monitores;

  if (filtros?.tipoPanel) {
    resultado = resultado.filter(
      (m) => m.tipoPanel.toLowerCase() === filtros.tipoPanel!.toLowerCase()
    );
  }

  if (filtros?.marca) {
    resultado = resultado.filter((m) =>
      m.marca.toLowerCase().includes(filtros.marca!.toLowerCase())
    );
  }

  return resultado;
}

/**
 * Busca un monitor por id. Lanza AppError 404 si no existe.
 */
function obtenerPorId(id: number): Monitor {
  const monitor = monitores.find((m) => m.id === id);
  if (!monitor) {
    throw new AppError(`No se encontró un monitor con id ${id}`, 404);
  }
  return monitor;
}

/**
 * Crea un nuevo monitor y lo agrega al catálogo.
 */
function crear(data: CrearMonitorDTO): Monitor {
  const ahora = new Date().toISOString();
  const nuevoMonitor: Monitor = {
    id: siguienteId++,
    ...data,
    creadoEn: ahora,
    actualizadoEn: ahora,
  };
  monitores.push(nuevoMonitor);
  return nuevoMonitor;
}

/**
 * Actualiza (total o parcialmente) un monitor existente.
 */
function actualizar(id: number, data: ActualizarMonitorDTO): Monitor {
  const monitor = obtenerPorId(id);
  const actualizado: Monitor = {
    ...monitor,
    ...data,
    id: monitor.id, // el id nunca se sobreescribe
    actualizadoEn: new Date().toISOString(),
  };

  monitores = monitores.map((m) => (m.id === id ? actualizado : m));
  return actualizado;
}

/**
 * Elimina un monitor del catálogo. Lanza AppError 404 si no existe.
 */
function eliminar(id: number): void {
  const existe = monitores.some((m) => m.id === id);
  if (!existe) {
    throw new AppError(`No se encontró un monitor con id ${id}`, 404);
  }
  monitores = monitores.filter((m) => m.id !== id);
}

export const monitorService = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
