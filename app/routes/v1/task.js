import express from 'express';
import TaskMiddleware from '../../middleware/task/task';
import AuthMiddleware from '../../middleware/auth/auth';
import TaskController from '../../controllers/task';

const { authenticate } = AuthMiddleware;
const {
  taskTitle,
  Task,
  deleteTaskItem,
  updateItemStatus,
  searchTask,
  getTaskList,
  getAllTask,
  updateItemStatusToPending,
} = TaskController;
const {
  taskValidator,
  taskListValidator,
  checkIfOwner,
  checkIfOwnerOfTask,
  checkIfTaskExist,
  checkIfTitleExist,
  verifyOwner
} = TaskMiddleware;

const router = express.Router();
router.use(authenticate);
router.post('/task', taskValidator, taskTitle);
router.post('/item/:listId', taskListValidator, checkIfOwner, Task);
router.delete(
  '/item/:id',
  checkIfTaskExist,
  checkIfOwnerOfTask,
  deleteTaskItem
);
router.patch(
  '/items/:id/complete-status',
  checkIfTaskExist,
  checkIfOwnerOfTask,
  updateItemStatus
);

router.patch(
  '/items/:id/status',
  checkIfTaskExist,
  checkIfOwnerOfTask,
  updateItemStatusToPending
);
router.post('/items/search', searchTask);
router.get('/items/:id/item', checkIfTitleExist, checkIfOwner, getTaskList);
router.get('/items/:user_id', getAllTask);

export default router;
