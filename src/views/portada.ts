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
