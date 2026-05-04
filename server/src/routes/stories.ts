import { Router } from 'express';
import StoryController from '../controllers/storyController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate());

router.post('/', StoryController.createStory);
router.get('/', StoryController.getStories);
router.get('/:id', StoryController.getStoryById);
router.put('/:id', StoryController.updateStory);
router.delete('/:id', StoryController.deleteStory);
router.put('/:id/reorder', StoryController.reorderStories);

export default router;
