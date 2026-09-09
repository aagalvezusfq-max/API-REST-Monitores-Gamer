const app = document.getElementById("app");
const toastEl = document.getElementById("toast");
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");
const IMAGEN_DEFAULT = "/images/placeholder.png";

toggle.addEventListener("click", () => nav.classList.toggle("open"));

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-link]");
  if (!link) return;
  event.preventDefault();
  nav.classList.remove("open");
  history.pushState({}, "", link.getAttribute("href"));
  render();
});

window.addEventListener("popstate", render);

function toast(mensaje) {
  toastEl.hidden = false;
  toastEl.textContent = mensaje;
  setTimeout(() => {
    toastEl.hidden = true;
  }, 2400);
}

function escapeHtml(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatoPrecio(precio) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(precio);
}

function rutaActual() {
  return location.pathname.replace(/\/$/, "") || "/";
}

function marcarNav() {
  const ruta = rutaActual();
  document.querySelectorAll(".nav a").forEach((enlace) => {
    const href = enlace.getAttribute("href");
    const activo =
      href === ruta || (href === "/catalogo" && ruta.startsWith("/monitor"));
    enlace.classList.toggle("active", activo);
  });
}

async function api(ruta, opciones = {}) {
  const respuesta = await fetch(ruta, {
    headers: { "Content-Type": "application/json", ...(opciones.headers || {}) },
    ...opciones,
  });
  if (respuesta.status === 204) return null;
  const body = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const detalles = body.error?.detalles
      ? body.error.detalles.map((item) => item.mensaje).join(" · ")
      : "";
    throw new Error(detalles || body.error?.mensaje || "Error de red");
  }
  return body;
}

async function render() {
  marcarNav();
  const ruta = rutaActual();
  try {
    if (ruta === "/") {
      await vistaInicio();
      return;
    }
    if (ruta === "/catalogo") {
      await vistaCatalogo();
      return;
    }
    if (ruta === "/nuevo") {
      vistaFormulario();
      return;
    }
    if (ruta === "/docs") {
      vistaDocs();
      return;
    }
    const detalle = ruta.match(/^\/monitor\/(\d+)$/);
    if (detalle) {
      await vistaDetalle(Number(detalle[1]));
      return;
    }
    const editar = ruta.match(/^\/editar\/(\d+)$/);
    if (editar) {
      await vistaFormulario(Number(editar[1]));
      return;
    }
    app.innerHTML = `<section class="wrap notice"><h1>Página no encontrada</h1><p>Esa ruta no existe en el catálogo.</p><a class="btn btn-primary" href="/catalogo" data-link>Volver al catálogo</a></section>`;
  } catch (error) {
    app.innerHTML = `<section class="wrap notice"><h1>No se pudo cargar</h1><p>${escapeHtml(error.message)}</p></section>`;
  }
}

async function vistaInicio() {
  const { data } = await api("/api/monitores");
  const destacados = data.slice(0, 3);
  app.innerHTML = `
    <section class="wrap">
      <div class="hero">
        <div>
          <p class="kicker">Catálogo gamer 2026</p>
          <h1>Monitores pensados para jugar sin límites.</h1>
          <p class="lead">Explora paneles IPS, VA, TN y OLED. Filtra, abre cada ficha, crea modelos nuevos y actualiza el inventario. Todo habla con la API REST en memoria.</p>
          <div class="actions">
            <a class="btn btn-primary" href="/catalogo" data-link>Ver catálogo</a>
            <a class="btn btn-ghost" href="/nuevo" data-link>Agregar monitor</a>
          </div>
        </div>
        <div class="hero-media">
          <img src="/images/hero.png" alt="Setup gamer con monitores" />
        </div>
      </div>
      <div class="stats">
        <article class="stat"><b>${data.length}</b><span>modelos en inventario</span></article>
        <article class="stat"><b>${Math.max(...data.map((m) => m.tasaRefresco), 0)} Hz</b><span>tasa de refresco máxima</span></article>
        <article class="stat"><b>${new Set(data.map((m) => m.tipoPanel)).size}</b><span>tipos de panel</span></article>
      </div>
      <h2 style="margin:36px 0 16px">Destacados</h2>
      <div class="grid">${destacados.map(tarjeta).join("") || vacio()}</div>
    </section>
  `;
}

async function vistaCatalogo() {
  const { data } = await api("/api/monitores");
  app.innerHTML = `
    <section class="wrap">
      <p class="kicker">Inventario</p>
      <h1>Catálogo</h1>
      <div class="toolbar">
        <div class="filters">
          ${["Todos", "IPS", "VA", "TN", "OLED"]
            .map((tipo, i) => `<button class="chip${i === 0 ? " active" : ""}" data-panel="${tipo}">${tipo}</button>`)
            .join("")}
        </div>
        <input class="search" type="search" placeholder="Buscar marca o modelo" />
      </div>
      <div id="grid" class="grid">${data.map(tarjeta).join("")}</div>
    </section>
  `;

  const grid = document.getElementById("grid");
  const chips = [...document.querySelectorAll(".chip")];
  const search = document.querySelector(".search");
  let panel = "Todos";

  function pintar() {
    const q = search.value.trim().toLowerCase();
    const filtrados = data.filter((monitor) => {
      const panelOk = panel === "Todos" || monitor.tipoPanel === panel;
      const texto = `${monitor.marca} ${monitor.modelo}`.toLowerCase();
      return panelOk && texto.includes(q);
    });
    grid.innerHTML = filtrados.map(tarjeta).join("") || vacio();
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      panel = chip.dataset.panel;
      pintar();
    });
  });
  search.addEventListener("input", pintar);
}

function tarjeta(monitor) {
  return `
    <article class="card">
      <a href="/monitor/${monitor.id}" data-link>
        <img src="${escapeHtml(monitor.imagen || IMAGEN_DEFAULT)}" alt="${escapeHtml(monitor.modelo)}" onerror="this.src='${IMAGEN_DEFAULT}'" />
      </a>
      <div class="card-body">
        <span class="badge">${escapeHtml(monitor.tipoPanel)} · ${escapeHtml(String(monitor.tasaRefresco))} Hz</span>
        <strong>${escapeHtml(monitor.marca)}</strong>
        <h3 style="margin:0">${escapeHtml(monitor.modelo)}</h3>
        <p class="price">${formatoPrecio(monitor.precio)}</p>
        <a class="btn btn-ghost" href="/monitor/${monitor.id}" data-link>Ver ficha</a>
      </div>
    </article>
  `;
}

function vacio() {
  return `<div class="empty">No hay monitores con ese filtro.</div>`;
}

async function vistaDetalle(id) {
  const { data } = await api(`/api/monitores/${id}`);
  app.innerHTML = `
    <section class="wrap detail">
      <img src="${escapeHtml(data.imagen || IMAGEN_DEFAULT)}" alt="${escapeHtml(data.modelo)}" onerror="this.src='${IMAGEN_DEFAULT}'" />
      <div class="panel" style="padding:24px">
        <p class="kicker">${escapeHtml(data.marca)}</p>
        <h1>${escapeHtml(data.modelo)}</h1>
        <p class="price">${formatoPrecio(data.precio)}</p>
        <table class="spec">
          <tr><th>Pantalla</th><td>${escapeHtml(String(data.tamanoPantalla))}"</td></tr>
          <tr><th>Refresco</th><td>${escapeHtml(String(data.tasaRefresco))} Hz</td></tr>
          <tr><th>Resolución</th><td>${escapeHtml(data.resolucion)}</td></tr>
          <tr><th>Panel</th><td>${escapeHtml(data.tipoPanel)}</td></tr>
        </table>
        <div class="actions">
          <a class="btn btn-primary" href="/editar/${data.id}" data-link>Editar</a>
          <button class="btn btn-danger" id="borrar">Eliminar</button>
          <a class="btn btn-ghost" href="/catalogo" data-link>Volver</a>
        </div>
      </div>
    </section>
  `;
  document.getElementById("borrar").addEventListener("click", async () => {
    if (!confirm(`¿Eliminar ${data.modelo}?`)) return;
    await api(`/api/monitores/${id}`, { method: "DELETE" });
    toast("Monitor eliminado");
    history.pushState({}, "", "/catalogo");
    render();
  });
}

async function vistaFormulario(id) {
  const existente = id ? (await api(`/api/monitores/${id}`)).data : null;
  app.innerHTML = `
    <section class="wrap">
      <p class="kicker">${existente ? "Actualizar" : "Nuevo modelo"}</p>
      <h1>${existente ? "Editar monitor" : "Agregar monitor"}</h1>
      <form class="form panel" style="padding:24px" id="form-monitor">
        <div class="form-row">
          <label>Marca<input name="marca" required value="${escapeHtml(existente?.marca || "")}" /></label>
          <label>Modelo<input name="modelo" required value="${escapeHtml(existente?.modelo || "")}" /></label>
        </div>
        <div class="form-row">
          <label>Tamaño (pulgadas)<input name="tamanoPantalla" type="number" step="0.1" min="1" required value="${existente?.tamanoPantalla ?? 27}" /></label>
          <label>Refresco (Hz)<input name="tasaRefresco" type="number" min="1" required value="${existente?.tasaRefresco ?? 144}" /></label>
        </div>
        <div class="form-row">
          <label>Resolución<input name="resolucion" required placeholder="2560x1440" value="${escapeHtml(existente?.resolucion || "")}" /></label>
          <label>Panel
            <select name="tipoPanel">
              ${["IPS", "VA", "TN", "OLED"]
                .map(
                  (tipo) =>
                    `<option ${existente?.tipoPanel === tipo ? "selected" : ""}>${tipo}</option>`
                )
                .join("")}
            </select>
          </label>
        </div>
        <div class="form-row">
          <label>Precio USD<input name="precio" type="number" min="0" step="0.01" required value="${existente?.precio ?? 499}" /></label>
          <label>Imagen (ruta o URL)<input name="imagen" placeholder="/images/placeholder.png" value="${escapeHtml(existente?.imagen || "")}" /></label>
        </div>
        <p class="error-list" id="form-error"></p>
        <div class="actions">
          <button class="btn btn-primary" type="submit">${existente ? "Guardar cambios" : "Crear monitor"}</button>
          <a class="btn btn-ghost" href="/catalogo" data-link>Cancelar</a>
        </div>
      </form>
    </section>
  `;

  document.getElementById("form-monitor").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const error = document.getElementById("form-error");
    const payload = {
      marca: form.marca.value.trim(),
      modelo: form.modelo.value.trim(),
      tamanoPantalla: Number(form.tamanoPantalla.value),
      tasaRefresco: Number(form.tasaRefresco.value),
      resolucion: form.resolucion.value.trim(),
      tipoPanel: form.tipoPanel.value,
      precio: Number(form.precio.value),
      imagen: form.imagen.value.trim() || undefined,
    };
    try {
      if (existente) {
        await api(`/api/monitores/${id}`, { method: "PUT", body: JSON.stringify(payload) });
        toast("Monitor actualizado");
        history.pushState({}, "", `/monitor/${id}`);
      } else {
        const creado = await api("/api/monitores", { method: "POST", body: JSON.stringify(payload) });
        toast("Monitor creado");
        history.pushState({}, "", `/monitor/${creado.data.id}`);
      }
      render();
    } catch (err) {
      error.textContent = err.message;
    }
  });
}

function vistaDocs() {
  app.innerHTML = `
    <section class="wrap docs">
      <p class="kicker">Backend</p>
      <h1>Rutas de la API</h1>
      <p class="lead">La interfaz consume estos endpoints. También puedes probarlos con curl o Postman.</p>
      <div class="panel" style="padding:8px 16px">
        <table>
          <tr><th>Método</th><th>Ruta</th><th>Uso</th></tr>
          <tr><td><span class="method m-get">GET</span></td><td>/api/health</td><td>Estado del servicio</td></tr>
          <tr><td><span class="method m-get">GET</span></td><td>/api/monitores</td><td>Listar catálogo</td></tr>
          <tr><td><span class="method m-get">GET</span></td><td>/api/monitores/:id</td><td>Ficha de un modelo</td></tr>
          <tr><td><span class="method m-post">POST</span></td><td>/api/monitores</td><td>Crear</td></tr>
          <tr><td><span class="method m-put">PUT</span></td><td>/api/monitores/:id</td><td>Actualizar</td></tr>
          <tr><td><span class="method m-patch">PATCH</span></td><td>/api/monitores/:id</td><td>Actualizar parcial</td></tr>
          <tr><td><span class="method m-delete">DELETE</span></td><td>/api/monitores/:id</td><td>Eliminar</td></tr>
        </table>
      </div>
    </section>
  `;
}

render();
