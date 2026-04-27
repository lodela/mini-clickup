import { Router } from "express";
import SprintController from "../controllers/sprintController";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(authenticate());

router.post("/", SprintController.createSprint);
router.get("/", SprintController.getSprints);
router.get("/:id", SprintController.getSprintById);
router.put("/:id", SprintController.updateSprint);
router.delete("/:id", SprintController.deleteSprint);

export default router;
