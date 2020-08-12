import TaskServices from '../../services/task';
import { DBError, constants, ApiError } from '../../utils';
import Helper from '../../utils/helpers';
import TaskModel from '../../models/task';
import { serverError, notFoundError, unauthorizedError } from '../../utils/messages';

const { successResponse } = Helper;
const {
  CREATE_TITLE,
  CREATE_LIST,
  DELETE_ITEM,
  UPDATE_ITEM_STATUS,
  FETCH_TASKS_SUCCESSFULLY,
} = constants;
const {
  createTitle,
  deleteAnItem,
  updateStatusById,
  searchItemByTitle,
  getbucketList,
  updateStatusByIdToPending,
  fetchAllTask,
} = TaskServices;
/**
 *
 * @class TaskController
 */
class TaskController {
  /**
   * @static
   * @param {object} req - a request from an endpoint
   * @param {object} res - the response returned by the method
   *@returns { JSON } A JSON response
   * @memberof TaskController
   */
  static async taskTitle(req, res) {
    try {
      const data = await createTitle(req.locals.id, req.body.title);
      return successResponse(res, {
        message: CREATE_TITLE,
        data,
      });
    } catch (error) {
      serverError(res, error.message);
    }
  }

  /**
   * @static
   * @param {object} req - a request from an endpoint
   * @param {object} res - the response returned by the method
   *@returns { JSON } A JSON response
   * @memberof TaskController
   */
  static async Task(req, res) {
    const { listId } = req.params;
    try {
      const data = await new TaskModel({ listId, ...req.body });
      await data.save();
      return successResponse(res, {
        status: 201,
        message: CREATE_LIST,
        data,
      });
    } catch (error) {
      serverError(res, error.message);
    }
  }

  /**
   * @static
   * @param {object} req - a request from an endpoint
   * @param {object} res - the response returned by the method
   *@returns { JSON } A JSON response
   * @memberof TaskController
   */
  static async deleteTaskItem(req, res) {
    try {
      await deleteAnItem(req.params.id);
      return successResponse(res, {
        status: 201,
        message: DELETE_ITEM,
      });
    } catch (error) {
      serverError(res, error.message);
    }
  }

  /**
   * @static
   * @param {object} req - a request from an endpoint
   * @param {object} res - the response returned by the method
   *@returns { JSON } A JSON response
   * @memberof TaskController
   */
  static async getTaskList(req, res) {
    try {
      const data = await getbucketList(req.params.id);
      return successResponse(res, {
        status: 201,
        data,
      });
    } catch (error) {
      serverError(res, error.message);
    }
  }

  /**
   * a method to update an item status
   * @static
   * @param {object} req - a request from an endpoint
   * @param {object} res - the response returned by the method
   *@returns { JSON } A JSON response
   * @memberof TaskController
   */
  static async updateItemStatus(req, res) {
    const { id } = req.params;
    try {
      const data = await updateStatusById(id);
      return successResponse(res, {
        status: 201,
        message: UPDATE_ITEM_STATUS,
      });
    } catch (error) {
      serverError(res, error.message);
    }
  }

  static async updateItemStatusToPending(req, res) {
    const { id } = req.params;
    try {
      const data = await updateStatusByIdToPending(id);
      return successResponse(res, {
        status: 201,
        message: UPDATE_ITEM_STATUS,
      });
    } catch (error) {
      serverError(res, error.message);
    }
  }

  /**
   * search dor a task
   * @static
   * @param {object} req - a request from an endpoint
   * @param {object} res - the response returned by the method
   *@returns { JSON } A JSON response
   * @memberof TaskController
   */
  static async searchTask(req, res) {
    try {
      const data = await searchItemByTitle(...req.query.q);
      if (data.length > 0) {
        return successResponse(res, {
          status: 201,
          message: 'result',
          data,
        });
      }
      notFoundError(res, 'Task does not exist');
    } catch (error) {
      serverError(res, error.message);
    }
  }

  static async getAllTask(req, res) {
    try {
      const data = await fetchAllTask({ ...req.query.q, ...req.params });

      return successResponse(res, {
        status: 201,
        message: FETCH_TASKS_SUCCESSFULLY,
        data,
      });
    } catch (error) {
      serverError(res, error.message);
    }
  }
}
export default TaskController;
