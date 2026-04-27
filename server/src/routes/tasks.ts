import { Router } from "express";
import TaskController from "../controllers/taskController";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(authenticate());

router.post("/", TaskController.createTask);
router.get("/", TaskController.getTasks);
router.get("/:id", TaskController.getTaskById);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

// Workflow routes
router.post("/:id/convert-to-bug", TaskController.convertToBug);
router.post("/:id/approve-for-sprint", TaskController.approveForSprint);

export default router;
