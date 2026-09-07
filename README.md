# API Monitores Gamer

API REST desarrollada con **Node.js**, **Express** y **TypeScript** para gestionar un catálogo de monitores gamer. El backend expone operaciones CRUD completas sobre una colección almacenada en memoria, organizada en capas (rutas, controladores, servicios y modelos) y con middlewares personalizados de logging, request id, validación y manejo centralizado de errores.

## Tema

Catálogo de monitores destinados al mercado de videojuegos. Cada monitor tiene: `marca`, `modelo`, `tamanoPantalla` (pulgadas), `tasaRefresco` (Hz), `resolucion`, `tipoPanel` (`IPS` | `VA` | `TN` | `OLED`) y `precio`.

## Estructura del proyecto

```
api-monitores-gamer/
├── src/
│   ├── controllers/
│   │   └── monitor.controller.ts   # Maneja req/res, delega al service
│   ├── services/
│   │   └── monitor.service.ts      # Lógica de negocio + datos en memoria
│   ├── models/
│   │   └── monitor.model.ts        # Tipos e interfaces de dominio (DTOs)
│   ├── routes/
│   │   ├── index.ts                # Router raíz (/api)
│   │   └── monitor.routes.ts       # Endpoints de /api/monitores
│   ├── middlewares/
│   │   ├── requestId.middleware.ts       # Genera/propaga X-Request-Id
│   │   ├── logger.middleware.ts          # Logging de cada solicitud
│   │   ├── validarMonitor.middleware.ts  # Validación de body/params
│   │   └── errorHandler.middleware.ts    # 404 + manejo centralizado de errores
│   ├── utils/
│   │   └── AppError.ts             # Error de dominio con statusCode
│   ├── app.ts                      # Configuración de Express (middlewares, rutas)
│   └── server.ts                   # Punto de entrada (arranca el servidor)
├── requests.md                     # Ejemplos de pruebas manuales (GET/POST/PUT/PATCH/DELETE)
├── package.json
├── tsconfig.json
└── .gitignore
```

## Instalación

Requisitos: Node.js 18+ y npm.

```bash
git clone <url-del-repositorio>
cd api-monitores-gamer
npm install
```

## Comandos disponibles

| Comando         | Descripción                                                        |
|-----------------|---------------------------------------------------------------------|
| `npm run dev`   | Levanta el servidor en modo desarrollo con recarga automática (nodemon + ts-node) |
| `npm run build` | Compila TypeScript a JavaScript en `dist/`                          |
| `npm start`     | Ejecuta la versión compilada (`dist/server.js`)                     |
| `npm run lint`  | Verifica tipos sin emitir archivos (`tsc --noEmit`)                 |

Por defecto el servidor corre en `http://localhost:3000`. Puede cambiarse con la variable de entorno `PORT`.

## Endpoints

Prefijo base: `/api`

| Método | Endpoint              | Descripción                                   | Código éxito |
|--------|------------------------|-----------------------------------------------|--------------|
| GET    | `/health`              | Verifica que la API está activa               | 200          |
| GET    | `/monitores`           | Lista todos los monitores (filtros opcionales `?marca=` y `?tipoPanel=`) | 200 |
| GET    | `/monitores/:id`       | Obtiene un monitor por id                     | 200          |
| POST   | `/monitores`           | Crea un nuevo monitor                         | 201          |
| PUT    | `/monitores/:id`       | Actualiza (total o parcialmente) un monitor   | 200          |
| PATCH  | `/monitores/:id`       | Actualiza parcialmente un monitor             | 200          |
| DELETE | `/monitores/:id`       | Elimina un monitor                            | 204          |

### Códigos de error comunes

| Código | Cuándo ocurre                                              |
|--------|-------------------------------------------------------------|
| 400    | El `:id` de la ruta no es un entero positivo                |
| 404    | El monitor solicitado no existe, o la ruta no existe         |
| 422    | El body no cumple las reglas de validación                   |
| 500    | Error inesperado no controlado                                |

Cada respuesta de error tiene la forma:

```json
{
  "error": {
    "mensaje": "descripción del error",
    "detalles": [ { "campo": "precio", "mensaje": "Debe ser un número mayor o igual a 0" } ],
    "requestId": "uuid-de-la-solicitud"
  }
}
```

## Middlewares personalizados

1. **`requestIdMiddleware`**: genera un `X-Request-Id` único por solicitud (o reutiliza el enviado por el cliente) y lo agrega al header de respuesta, para trazabilidad.
2. **`loggerMiddleware`**: registra en consola método, ruta, `requestId`, código de estado y duración de cada solicitud.
3. **`validarMonitor.middleware.ts`**: valida el body en creación/actualización y el `:id` de los parámetros de ruta.
4. **`errorHandler`**: middleware centralizado (4 argumentos) que captura cualquier error lanzado (`AppError` o inesperado) y responde con un formato JSON consistente.

## Pruebas manuales

Ver [`requests.md`](./requests.md) para ejemplos completos de solicitudes y respuestas (GET, POST, PUT, PATCH, DELETE) usando `curl`.

## Flujo de Git/GitHub sugerido

```bash
git init
git checkout -b main
git add .
git commit -m "chore: estructura inicial del proyecto (Express + TS)"

git checkout -b feature/modelo-y-servicio
# ... implementar models + services ...
git commit -m "feat: modelo Monitor y servicio con CRUD en memoria"

git checkout -b feature/rutas-controladores
# ... implementar routes + controllers ...
git commit -m "feat: rutas y controladores CRUD de monitores"

git checkout -b feature/middlewares
# ... implementar middlewares ...
git commit -m "feat: middlewares de requestId, logging, validación y manejo de errores"

git checkout main
git merge feature/modelo-y-servicio
git merge feature/rutas-controladores
git merge feature/middlewares
git push origin main
```

## Posibles mejoras futuras

- Persistencia con base de datos (PostgreSQL/MongoDB).
- Autenticación y autorización (JWT).
- Paginación en el listado.
- Pruebas automatizadas (Jest + Supertest).
- Despliegue en un servicio de alojamiento (Render, Railway, etc).
