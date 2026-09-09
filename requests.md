# Pruebas manuales — API Monitores Gamer

Todos los ejemplos asumen que el servidor corre localmente en `http://localhost:3000` (`npm run dev`). Se puede usar `curl`, Postman o Thunder Client (VS Code).

---

## 1. Portada — GET /

En el navegador (`http://localhost:3000/`) se muestra una portada HTML. `curl` y Postman reciben JSON.

**Response — 200 OK**
```json
{
  "nombre": "API Monitores Gamer",
  "version": "1.0.0",
  "health": "/api/health",
  "catalogo": "/api/monitores"
}
```

---

## 1.1 Health check

**Request**
```bash
curl -i http://localhost:3000/api/health
```

**Response — 200 OK**
```json
{
  "status": "ok",
  "timestamp": "2026-09-07T15:00:00.000Z"
}
```

---

## 2. GET /api/monitores — listar todos

**Request**
```bash
curl -i http://localhost:3000/api/monitores
```

**Response — 200 OK**
```json
{
  "total": 3,
  "data": [
    {
      "id": 1,
      "marca": "ASUS",
      "modelo": "ROG Swift PG27AQN",
      "tamanoPantalla": 27,
      "tasaRefresco": 360,
      "resolucion": "2560x1440",
      "tipoPanel": "IPS",
      "precio": 899.99,
      "creadoEn": "2026-09-07T14:00:00.000Z",
      "actualizadoEn": "2026-09-07T14:00:00.000Z"
    }
  ]
}
```

### 2.1 Con filtros — GET /api/monitores?tipoPanel=OLED

**Request**
```bash
curl -i "http://localhost:3000/api/monitores?tipoPanel=OLED"
```

**Response — 200 OK**
```json
{
  "total": 1,
  "data": [
    {
      "id": 3,
      "marca": "LG",
      "modelo": "UltraGear 27GR95QE",
      "tamanoPantalla": 27,
      "tasaRefresco": 240,
      "resolucion": "2560x1440",
      "tipoPanel": "OLED",
      "precio": 999.99,
      "creadoEn": "2026-09-07T14:00:00.000Z",
      "actualizadoEn": "2026-09-07T14:00:00.000Z"
    }
  ]
}
```

---

## 3. GET /api/monitores/:id — obtener uno

**Request**
```bash
curl -i http://localhost:3000/api/monitores/1
```

**Response — 200 OK**
```json
{
  "data": {
    "id": 1,
    "marca": "ASUS",
    "modelo": "ROG Swift PG27AQN",
    "tamanoPantalla": 27,
    "tasaRefresco": 360,
    "resolucion": "2560x1440",
    "tipoPanel": "IPS",
    "precio": 899.99,
    "creadoEn": "2026-09-07T14:00:00.000Z",
    "actualizadoEn": "2026-09-07T14:00:00.000Z"
  }
}
```

### 3.1 Id inexistente — GET /api/monitores/999

**Response — 404 Not Found**
```json
{
  "error": {
    "mensaje": "No se encontró un monitor con id 999",
    "requestId": "b1a2c3d4-...."
  }
}
```

### 3.2 Id inválido — GET /api/monitores/abc

**Response — 400 Bad Request**
```json
{
  "error": {
    "mensaje": "El parámetro id debe ser un entero positivo, se recibió \"abc\"",
    "requestId": "b1a2c3d4-...."
  }
}
```

---

## 4. POST /api/monitores — crear

**Request**
```bash
curl -i -X POST http://localhost:3000/api/monitores \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "Alienware",
    "modelo": "AW2725DF",
    "tamanoPantalla": 27,
    "tasaRefresco": 280,
    "resolucion": "2560x1440",
    "tipoPanel": "OLED",
    "precio": 749.99
  }'
```

**Response — 201 Created**
```json
{
  "data": {
    "id": 4,
    "marca": "Alienware",
    "modelo": "AW2725DF",
    "tamanoPantalla": 27,
    "tasaRefresco": 280,
    "resolucion": "2560x1440",
    "tipoPanel": "OLED",
    "precio": 749.99,
    "creadoEn": "2026-09-07T15:05:00.000Z",
    "actualizadoEn": "2026-09-07T15:05:00.000Z"
  }
}
```

### 4.1 Body inválido — POST /api/monitores

**Request**
```bash
curl -i -X POST http://localhost:3000/api/monitores \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "",
    "tamanoPantalla": -5,
    "resolucion": "1920-1080",
    "tipoPanel": "LED",
    "precio": -10
  }'
```

**Response — 422 Unprocessable Entity**
```json
{
  "error": {
    "mensaje": "Datos de monitor inválidos",
    "detalles": [
      { "campo": "marca", "mensaje": "Debe ser un texto no vacío" },
      { "campo": "modelo", "mensaje": "Este campo es obligatorio" },
      { "campo": "tamanoPantalla", "mensaje": "Debe ser un número mayor a 0" },
      { "campo": "tasaRefresco", "mensaje": "Este campo es obligatorio" },
      { "campo": "resolucion", "mensaje": "Debe tener el formato \"ANCHOxALTO\", ej. \"1920x1080\"" },
      { "campo": "tipoPanel", "mensaje": "Debe ser uno de: IPS, VA, TN, OLED" },
      { "campo": "precio", "mensaje": "Debe ser un número mayor o igual a 0" }
    ],
    "requestId": "b1a2c3d4-...."
  }
}
```

---

## 5. PUT /api/monitores/:id — actualizar (total)

**Request**
```bash
curl -i -X PUT http://localhost:3000/api/monitores/1 \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "ASUS",
    "modelo": "ROG Swift PG27AQN",
    "tamanoPantalla": 27,
    "tasaRefresco": 360,
    "resolucion": "2560x1440",
    "tipoPanel": "IPS",
    "precio": 849.99
  }'
```

**Response — 200 OK**
```json
{
  "data": {
    "id": 1,
    "marca": "ASUS",
    "modelo": "ROG Swift PG27AQN",
    "tamanoPantalla": 27,
    "tasaRefresco": 360,
    "resolucion": "2560x1440",
    "tipoPanel": "IPS",
    "precio": 849.99,
    "creadoEn": "2026-09-07T14:00:00.000Z",
    "actualizadoEn": "2026-09-07T15:10:00.000Z"
  }
}
```

---

## 6. PATCH /api/monitores/:id — actualizar (parcial)

**Request**
```bash
curl -i -X PATCH http://localhost:3000/api/monitores/2 \
  -H "Content-Type: application/json" \
  -d '{ "precio": 1199.00 }'
```

**Response — 200 OK**
```json
{
  "data": {
    "id": 2,
    "marca": "Samsung",
    "modelo": "Odyssey G9",
    "tamanoPantalla": 49,
    "tasaRefresco": 240,
    "resolucion": "5120x1440",
    "tipoPanel": "VA",
    "precio": 1199.0,
    "creadoEn": "2026-09-07T14:00:00.000Z",
    "actualizadoEn": "2026-09-07T15:12:00.000Z"
  }
}
```

### 6.1 Body vacío — PATCH /api/monitores/2

**Request**
```bash
curl -i -X PATCH http://localhost:3000/api/monitores/2 \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response — 422 Unprocessable Entity**
```json
{
  "error": {
    "mensaje": "El cuerpo de la solicitud no puede estar vacío",
    "requestId": "b1a2c3d4-...."
  }
}
```

---

## 7. DELETE /api/monitores/:id — eliminar

**Request**
```bash
curl -i -X DELETE http://localhost:3000/api/monitores/3
```

**Response — 204 No Content** (sin body)

### 7.1 Eliminar id inexistente — DELETE /api/monitores/999

**Response — 404 Not Found**
```json
{
  "error": {
    "mensaje": "No se encontró un monitor con id 999",
    "requestId": "b1a2c3d4-...."
  }
}
```

---

## 8. JSON malformado

**Request**
```bash
curl -i -X POST http://localhost:3000/api/monitores \
  -H "Content-Type: application/json" \
  -d '{ marca: sin-comillas }'
```

**Response — 400 Bad Request**
```json
{
  "error": {
    "mensaje": "El cuerpo de la solicitud no es un JSON válido",
    "requestId": "b1a2c3d4-...."
  }
}
```

---

## 9. Ruta inexistente

**Request**
```bash
curl -i http://localhost:3000/api/no-existe
```

**Response — 404 Not Found**
```json
{
  "error": {
    "mensaje": "La ruta GET /api/no-existe no existe",
    "requestId": "b1a2c3d4-...."
  }
}
```

---

## Evidencia de middlewares en acción

Cada solicitud (incluyendo las de arriba) queda registrada en la consola del servidor gracias a `loggerMiddleware`, por ejemplo:

```
[2026-09-07T15:05:00.000Z] [b1a2c3d4-e5f6-4a1b-9c2d-1234567890ab] POST /api/monitores -> 201 (3.42ms)
[2026-09-07T15:10:00.000Z] [c2b3d4e5-f6a7-4b2c-0d3e-234567890abc] PUT /api/monitores/1 -> 200 (1.87ms)
```

El header `X-Request-Id` (generado por `requestIdMiddleware`) también se puede confirmar en la respuesta con `curl -i` (aparece junto a los demás headers).
