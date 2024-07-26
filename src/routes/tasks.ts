import express from 'express';
import { createTask, getTasks, updateTask, deleteTask, editTask } from '../controllers/taskController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.patch('/:id', editTask);
router.delete('/:id', deleteTask);

export default router;
