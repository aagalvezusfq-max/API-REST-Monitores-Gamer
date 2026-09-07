/**
 * Tipos de panel soportados para un monitor gamer.
 */
export type TipoPanel = "IPS" | "VA" | "TN" | "OLED";

/**
 * Entidad de dominio: Monitor Gamer.
 * Representa un modelo de monitor destinado al mercado de videojuegos.
 */
export interface Monitor {
  id: number;
  marca: string;
  modelo: string;
  tamanoPantalla: number; // en pulgadas
  tasaRefresco: number; // en Hz
  resolucion: string; // ej. "1920x1080", "2560x1440"
  tipoPanel: TipoPanel;
  precio: number; // en USD
  creadoEn: string; // ISO timestamp
  actualizadoEn: string; // ISO timestamp
}

/**
 * Payload esperado al crear un monitor (sin campos generados por el servidor).
 */
export interface CrearMonitorDTO {
  marca: string;
  modelo: string;
  tamanoPantalla: number;
  tasaRefresco: number;
  resolucion: string;
  tipoPanel: TipoPanel;
  precio: number;
}

/**
 * Payload esperado al actualizar un monitor. Todos los campos son opcionales
 * porque se soporta actualización parcial (PATCH) además de PUT.
 */
export type ActualizarMonitorDTO = Partial<CrearMonitorDTO>;
