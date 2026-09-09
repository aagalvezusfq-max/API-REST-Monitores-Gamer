import app from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`🚀 API de monitores gamer corriendo en http://localhost:${PORT}`);
  console.log(`   Portada:      http://localhost:${PORT}/`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Catálogo UI:  http://localhost:${PORT}/catalogo`);
  console.log(`   API JSON:     http://localhost:${PORT}/api/monitores`);
});
