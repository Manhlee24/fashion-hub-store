import express from 'express';
import * as heroController from '../controllers/heroController.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', heroController.getHeroes);
router.post('/', authenticateToken, isAdmin, heroController.createHero);
router.put('/:id', authenticateToken, isAdmin, heroController.updateHero);
router.delete('/:id', authenticateToken, isAdmin, heroController.deleteHero);

export default router;
