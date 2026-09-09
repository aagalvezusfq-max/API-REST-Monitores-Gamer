import { Router } from "express";
import monitorRoutes from "./monitor.routes";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    mensaje: "API de monitores gamer",
    health: "/api/health",
    monitores: "/api/monitores",
  });
});

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/monitores", monitorRoutes);

export default router;
