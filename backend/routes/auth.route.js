
import express from 'express';
import { registerUser, loginUser, getMe, getUserStore } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/store/:username', getUserStore);

export default router;