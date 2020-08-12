import { createTaskSchema, createTaskListSchema } from '../../validation/task';
import TaskServices from '../../services/task';
import { serverError, notFoundError, unauthorizedError } from '../../utils/messages';

const { fetchList, fetchItems, fetchAllTask } = TaskServices;
/**
 *
 *
 * @class taskMiddleware
 */
class TaskMiddleware {
  /**
   *  validate task field
   * @static
   * @param {request} req - the request from the endpoint.
   * @param {Response} res - the response returned by the response
   * @param {Function} next - calls the next handle.
   * @returns {JSON| null}- returns an error response if validation fails or return null otherwise
   * @memberof taskMiddleware
   */
  static async taskValidator(req, res, next) {
    try {
      await createTaskSchema.validateAsync(req.body);
      next();
    } catch (error) {
      serverError(res, error.message);
    }
  }

  /**
   *  validate task field
   * @static
   * @param {request} req - the request from the endpoint.
   * @param {Response} res - the response returned by the response
   * @param {Function} next - calls the next handle.
   * @returns {JSON| null}- returns an error response if validation fails or return null otherwise
   * @memberof taskMiddleware
   */
  static async taskListValidator(req, res, next) {
    try {
      await createTaskListSchema.validateAsync(req.body);
      next();
    } catch (error) {
      serverError(res, error.message);
    }
  }

  /**
   *  validate task field
   * @static
   * @param {request} req - the request from the endpoint.
   * @param {Response} res - the response returned by the response
   * @param {Function} next - calls the next handle.
   * @returns {JSON| null}- returns an error response if validation fails or return null otherwise
   * @memberof taskMiddleware
   */
  static async checkIfOwner(req, res, next) {
    try {
      const { id } = req.locals;
      const data = await fetchList(req.params.listId || req.params.id);
      console.log(data);

      if (data.user_id !== id) {
        return unauthorizedError(res, "you can't edit this post");
      }
      next();
    } catch (error) {
      console.log(error);
      
      serverError(res, error.message);
    }
  }

  /**
   *  validate task field
   * @static
   * @param {request} req - the request from the endpoint.
   * @param {Response} res - the response returned by the response
   * @param {Function} next - calls the next handle.
   * @returns {JSON| null}- returns an error response if validation fails or return null otherwise
   * @memberof taskMiddleware
   */
  static async checkIfOwnerOfTask(req, res, next) {
    try {
      const { id } = req.locals;
      const data = await fetchList(req.data.list_id);
      if (data.user_id !== id) {
        return unauthorizedError(res, "you can't edit this post");
      }
      next();
    } catch (error) {
      serverError(res, error.message);
    }
  }

  /**
   *  check if task exist
   * @static
   * @param {request} req - the request from the endpoint.
   * @param {Response} res - the response returned by the response
   * @param {Function} next - calls the next handle.
   * @returns {JSON| null}- returns an error response if validation fails or return null otherwise
   * @memberof taskMiddleware
   */
  static async checkIfTaskExist(req, res, next) {
    try {
      const data = await fetchItems(req.params.id);
      if (!data) {
        notFoundError(res, 'Task does not exist');
      }
      req.data = data;
      next();
    } catch (error) {
      serverError(res, error.message);
    }
  }

  static async checkIfTitleExist(req, res, next) {
    try {
      const data = await fetchList(req.params.id);
      if (!data) {
        notFoundError(res, 'Task does not exist');
      }
      req.data = data;
      next();
    } catch (error) {
      serverError(res, error.message);
    }
  }
}
export default TaskMiddleware;
