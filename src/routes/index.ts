import { Router } from "express";
import monitorRoutes from "./monitor.routes";
import { apiInfo } from "../views/portada";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json(apiInfo);
});

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/monitores", monitorRoutes);

export default router;
