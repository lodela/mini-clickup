import { Router } from 'express';
import ProjectDocumentController from '../controllers/projectDocumentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate());

router.post('/', ProjectDocumentController.createDocument);
router.get('/', ProjectDocumentController.getDocuments);
router.get('/:id', ProjectDocumentController.getDocumentById);
router.put('/:id', ProjectDocumentController.updateDocument);
router.delete('/:id', ProjectDocumentController.deleteDocument);

export default router;
