export const apiInfo = {
  nombre: "API Monitores Gamer",
  version: "1.0.0",
  descripcion:
    "API REST para gestionar un catálogo de monitores destinados al mercado de videojuegos.",
  health: "/api/health",
  catalogo: "/api/monitores",
  endpoints: [
    { metodo: "GET", ruta: "/api/health", descripcion: "Estado del servicio" },
    {
      metodo: "GET",
      ruta: "/api/monitores",
      descripcion: "Listar monitores (filtros: marca, tipoPanel)",
    },
    {
      metodo: "GET",
      ruta: "/api/monitores/:id",
      descripcion: "Obtener un monitor por id",
    },
    { metodo: "POST", ruta: "/api/monitores", descripcion: "Crear un monitor" },
    {
      metodo: "PUT",
      ruta: "/api/monitores/:id",
      descripcion: "Actualizar un monitor",
    },
    {
      metodo: "PATCH",
      ruta: "/api/monitores/:id",
      descripcion: "Actualizar parcialmente un monitor",
    },
    {
      metodo: "DELETE",
      ruta: "/api/monitores/:id",
      descripcion: "Eliminar un monitor",
    },
  ],
};

export function renderPortadaHtml(): string {
  const filas = apiInfo.endpoints
    .map((endpoint) => {
      const esGet = endpoint.metodo === "GET" && !endpoint.ruta.includes(":id");
      const ruta = esGet
        ? `<a href="${endpoint.ruta}">${endpoint.ruta}</a>`
        : `<code>${endpoint.ruta}</code>`;

      return `<tr>
        <td><span class="metodo metodo-${endpoint.metodo.toLowerCase()}">${endpoint.metodo}</span></td>
        <td>${ruta}</td>
        <td>${endpoint.descripcion}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${apiInfo.nombre}</title>
  <style>
    :root {
      --bg: #0b1020;
      --card: #151b30;
      --text: #e8ecf8;
      --muted: #9aa3c2;
      --accent: #3ee0b0;
      --line: #2a3358;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Segoe UI, system-ui, sans-serif;
      background: radial-gradient(circle at top, #1a2450 0%, var(--bg) 45%);
      color: var(--text);
      min-height: 100vh;
    }
    main {
      max-width: 860px;
      margin: 0 auto;
      padding: 48px 24px;
    }
    h1 { margin: 0 0 8px; font-size: 2rem; }
    .version { color: var(--accent); font-weight: 600; }
    p { color: var(--muted); line-height: 1.5; }
    .acciones { display: flex; gap: 12px; flex-wrap: wrap; margin: 24px 0 32px; }
    a.boton {
      background: var(--accent);
      color: #06281e;
      text-decoration: none;
      font-weight: 700;
      padding: 10px 16px;
      border-radius: 8px;
    }
    a.boton.secundario {
      background: transparent;
      color: var(--accent);
      border: 1px solid var(--accent);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--card);
      border-radius: 12px;
      overflow: hidden;
    }
    th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--line); }
    th { color: var(--muted); font-size: 0.85rem; letter-spacing: 0.04em; }
    a { color: var(--accent); }
    .metodo {
      display: inline-block;
      min-width: 64px;
      text-align: center;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 999px;
    }
    .metodo-get { background: #1f6f4a; }
    .metodo-post { background: #1d4f8a; }
    .metodo-put { background: #8a6a1d; }
    .metodo-patch { background: #6a3d8a; }
    .metodo-delete { background: #8a2d2d; }
  </style>
</head>
<body>
  <main>
    <p class="version">v${apiInfo.version}</p>
    <h1>${apiInfo.nombre}</h1>
    <p>${apiInfo.descripcion}</p>
    <div class="acciones">
      <a class="boton" href="${apiInfo.catalogo}">Ver catálogo</a>
      <a class="boton secundario" href="${apiInfo.health}">Health check</a>
    </div>
    <table>
      <thead>
        <tr><th>Método</th><th>Ruta</th><th>Descripción</th></tr>
      </thead>
      <tbody>${filas}</tbody>
    </table>
  </main>
</body>
</html>`;
}
