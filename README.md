# API Monitores Gamer

API REST desarrollada con **Node.js**, **Express** y **TypeScript** para gestionar un catálogo de monitores gamer. El entregable principal es el backend por capas (rutas, controladores, servicios y modelos) con datos en memoria. Como extra se añadió una interfaz visual para facilitar la comprensión del CRUD.

## Tema

Universo creativo: catálogo de hardware para videojuegos. Cada monitor tiene al menos cinco campos de dominio tipados:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `marca` | `string` | Fabricante (ASUS, LG, Samsung, etc.) |
| `modelo` | `string` | Nombre comercial del monitor |
| `tamanoPantalla` | `number` | Diagonal en pulgadas |
| `tasaRefresco` | `number` | Hertz |
| `resolucion` | `string` | Formato `ANCHOxALTO` (ej. `2560x1440`) |
| `tipoPanel` | `"IPS" \| "VA" \| "TN" \| "OLED"` | Unión de literales |
| `precio` | `number` | Precio en USD |
| `imagen` | `string` | Ruta local o URL de la foto |

El servidor también genera `id`, `creadoEn` y `actualizadoEn`.

## Objetivos de aprendizaje

| Resultado | Cómo se demuestra en este proyecto |
|-----------|-------------------------------------|
| **RA1** | API del lado servidor para una aplicación web interactiva: CRUD de monitores en `/api/monitores`. |
| **RA2** | Node.js como runtime de eventos y no bloqueante: el servidor no espera I/O síncrono; el logger se suscribe a `res.on("finish")` para auditar cuando Express termina de enviar la respuesta. |
| **RA4** | Middleware para separar responsabilidades: parseo JSON, `requestId`, logging, validación y manejo centralizado de errores. |
| **Semanas 3–4** | Tipos complejos en TypeScript (`interface`, `type`, `Partial`, declaration merging), rutas REST, controladores, servicios y pruebas manuales. |

## Requisitos cubiertos

- Proyecto Node.js + Express + TypeScript
- Capas: `routes`, `controllers`, `services` y `models`
- Recurso principal con más de 5 campos tipados
- CRUD en memoria: listar, obtener por id, crear, actualizar y eliminar
- Más de 5 rutas REST con verbos y códigos de estado adecuados
- 3 middlewares personalizados (request id, logging, validación) + error handler centralizado
- Validación de entrada sin base de datos
- Pruebas manuales en [`requests.md`](./requests.md)
- Flujo Git con ramas `feature/*` y commits descriptivos

## Estructura del proyecto

```
api-monitores-gamer/
├── src/
│   ├── controllers/          # Traduce HTTP (req/res) y delega al servicio
│   ├── services/             # Lógica de negocio + arreglo en memoria
│   ├── models/               # Tipos e interfaces de dominio (DTOs)
│   ├── routes/               # Endpoints REST
│   ├── middlewares/          # requestId, logger, validación, errores
│   ├── utils/                # AppError con statusCode
│   ├── views/                # Metadatos JSON de /api
│   ├── app.ts                # Ensambla middlewares, API y frontend
│   └── server.ts             # Arranque del proceso (listen)
├── public/                   # Interfaz visual navegable
│   ├── index.html
│   ├── css/styles.css
│   ├── js/app.js
│   └── images/               # Hero, logo y fotos de monitores
├── requests.md               # Pruebas manuales GET/POST/PUT/PATCH/DELETE
├── package.json
├── tsconfig.json
└── .gitignore
```

## TypeScript intermedio

- `interface Monitor` y `CrearMonitorDTO` para modelar el dominio
- `type TipoPanel` como unión de literales
- `Partial<CrearMonitorDTO>` para actualizaciones PATCH
- *Declaration merging* de `Express.Request` para tipar `req.requestId`
- `AppError` como clase de error de aplicación
- `tsconfig` en modo `strict`

## Node.js no bloqueante

Express procesa cada petición en el event loop. El middleware de logging no bloquea la respuesta: registra `res.on("finish")` y llama a `next()` de inmediato. Cuando Node emite el evento `finish`, se escribe el log con método, ruta, `requestId`, status y duración.

## Instalación

Requisitos: Node.js 18+ y npm.

```bash
git clone https://github.com/aagalvezusfq-max/API-REST-Monitores-Gamer.git
cd API-REST-Monitores-Gamer
npm install
```

## Comandos

| Comando       | Descripción |
|---------------|-------------|
| `npm run dev` | Servidor de desarrollo con recarga (nodemon + ts-node) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start`   | Ejecuta `dist/server.js` |
| `npm run lint` | Verifica tipos (`tsc --noEmit`) |

Por defecto: `http://localhost:3000` (variable `PORT` para cambiarlo).

La interfaz visual está en `/` (inicio), `/catalogo`, `/monitor/:id`, `/nuevo` y `/docs`. `curl` y Postman siguen usando `/api`.

## Endpoints

Prefijo de negocio: `/api`

| Método | Ruta | Descripción | Éxito |
|--------|------|-------------|-------|
| GET | `/` | Interfaz visual (inicio) | 200 |
| GET | `/catalogo` | Catálogo con imágenes | 200 |
| GET | `/api` | Información JSON del servicio | 200 |
| GET | `/api/health` | Estado del servicio | 200 |
| GET | `/api/monitores` | Listar (`?marca=` y `?tipoPanel=` opcionales) | 200 |
| GET | `/api/monitores/:id` | Obtener uno | 200 |
| POST | `/api/monitores` | Crear | 201 |
| PUT | `/api/monitores/:id` | Actualizar | 200 |
| PATCH | `/api/monitores/:id` | Actualizar parcial | 200 |
| DELETE | `/api/monitores/:id` | Eliminar | 204 |

### Códigos de error

| Código | Cuándo |
|--------|--------|
| 400 | `:id` inválido o JSON malformado |
| 404 | Monitor o ruta inexistente |
| 422 | Body que no cumple las reglas de validación |
| 500 | Error no controlado |

Formato de error:

```json
{
  "error": {
    "mensaje": "Datos de monitor inválidos",
    "detalles": [{ "campo": "precio", "mensaje": "Debe ser un número mayor o igual a 0" }],
    "requestId": "uuid-de-la-solicitud"
  }
}
```

## Evidencia de middleware y manejo de errores

Cadena en `src/app.ts`:

1. `requestIdMiddleware` — genera o reutiliza `X-Request-Id`
2. `express.json()` — parseo del body
3. `loggerMiddleware` — auditoría al evento `finish`
4. Rutas en `/api`
5. `rutaNoEncontrada` — 404
6. `errorHandler` — 4 argumentos; captura `AppError`, JSON inválido y 500

Validación en `validarMonitor.middleware.ts` (antes del controlador): marca/modelo no vacíos, números positivos, resolución `^\d+x\d+$`, `tipoPanel` en la unión, `id` entero positivo.

Log de consola (evidencia RA2 + RA4):

```
[2026-09-09T15:01:25.289Z] [5d54572f-9b58-4f47-8b32-603c7891b92f] POST /api/monitores -> 201 (0.95ms)
[2026-09-09T15:01:25.304Z] [9a007ecc-06f3-4bbf-b6bd-039d63d90906] POST /api/monitores -> 422 (0.70ms)
[2026-09-09T15:01:25.351Z] [f71dc817-9be8-4384-9358-44a213cb1399] DELETE /api/monitores/3 -> 204 (0.95ms)
```

Ejemplos completos de GET, POST, PUT, PATCH, DELETE y errores: [`requests.md`](./requests.md).

## Extra: interfaz visual (no forma parte del requisito mínimo)

El temario pide demostrar el backend, no una aplicación visual. Aun así se agregó una UI en `public/` para **entender mejor** cómo un cliente usa la API: listar, ver detalle, crear, editar y eliminar sin tener que armar cada `curl`.

- No reemplaza a las capas REST ni a `requests.md`.
- Las pantallas hablan con los mismos endpoints (`GET/POST/PUT/PATCH/DELETE /api/monitores`).
- Rutas de la UI: `/` (inicio), `/catalogo`, `/monitor/:id`, `/nuevo`, `/editar/:id`, `/docs`.
- Si se agrega un monitor desde **Agregar**, el navegador envía `POST /api/monitores`. El dato queda en memoria y aparece en el catálogo; al reiniciar el servidor se pierde (no hay base de datos).

Sirve como apoyo didáctico: se ve el JSON de respuesta, los códigos de estado y el efecto del middleware de validación cuando el formulario envía datos incorrectos.

## Flujo Git

Ramas y commits descriptivos (convención `feat` / `docs` / `chore`):

| Rama | Commit |
|------|--------|
| `main` | `chore: estructura inicial del proyecto (Express + TypeScript)` |
| `feature/modelo-y-servicio` | `feat: modelo Monitor (DTOs tipados) y servicio con CRUD en memoria` |
| `feature/rutas-controladores` | `feat: rutas y controladores CRUD de /api/monitores` |
| `feature/middlewares` | `feat: middlewares de requestId, logging, validacion y manejo centralizado de errores` |
| `main` | `docs: README con instalacion/endpoints y requests.md con pruebas manuales` |
| `feature/portada-y-documentacion` | Portada HTML, 400 por JSON inválido y README alineado al temario |

```bash
git checkout main
git log --oneline --decorate --graph --all
```

## Posibles mejoras futuras

- Persistencia con base de datos
- Autenticación (JWT)
- Paginación
- Pruebas automatizadas (Jest + Supertest)
- Despliegue (Render, Railway, etc.)
