import { Router } from "express";
import { parcelsList } from "../controllers/parcels.controller";

const router = Router();

router.get("/", parcelsList);

export default router;
