import { Router } from 'express';
import EpicController from '../controllers/epicController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate());

router.post('/', EpicController.createEpic);
router.get('/', EpicController.getEpics);
router.get('/:id', EpicController.getEpicById);
router.put('/:id', EpicController.updateEpic);
router.delete('/:id', EpicController.deleteEpic);

export default router;
