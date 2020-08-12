import taskQueries from '../../db/queries/task';
import db from '../../db';
import Helper from '../../utils/helpers';

const { fetchItemsByPage, calcPages } = Helper;
const {
  createTask,
  fetchUserId,
  fetchItem,
  deleteItem,
  updateStatus,
  searchItem,
  getTask,
  fetchUserTaskByPagination,
  countTaskPerUser,
} = taskQueries;
/**
 * @class taskServices
 */
class TaskServices {
  /**
   *
   *
   * @static
   * @param {object} user_id - the id the the user
   * @param {object} title - the title of the task
   *@returns { Promise<Object | Error> } A promise that resolves or rejects
   * with a title object or a DB Error.
   * @memberof taskServices
   */
  static async createTitle(user_id, title) {
    return db.oneOrNone(createTask, [user_id, title]);
  }

  /**
   * @static
   * @param {number} listId
   * @returns  { Promise<Object | Error> } A promise that resolves or rejects
   * with a listId object or a DB Error.
   * @memberof TaskServices
   */
  static async fetchList(id) {
    return db.oneOrNone(fetchUserId, [id]);
  }

  /**
   * Fetches a paginate list tasks.
   * @memberof ReportService
   * @param {string} user_id - user_id
   * @returns { Promise<object | Error> } A promise that resolves or rejects
   * with an Array of users task objects or a DB Error.
   */
  static async fetchAllTask({ page = 5, limit = 10, user_id }) {
    const [count, taskList] = await fetchItemsByPage({
      page,
      limit,
      params: [user_id],
      getCount: countTaskPerUser,
      getUserTask: fetchUserTaskByPagination,
      countParams: [user_id],
    });
    return {
      total: count.itemcount,
      currentPage: page,
      totalPages: calcPages(count.itemcount, limit),
      taskList,
    };
  }

  /**
   * @static
   * @param {number} id
   * @returns  { Promise<Object | Error> } A promise that resolves or rejects
   * with a listId object or a DB Error.
   * @memberof TaskServices
   */
  static async fetchItems(id) {
    return db.oneOrNone(fetchItem, [id]);
  }

  /**
   * @static
   * @param {number} id
   * @returns  { Promise<Object | Error> } A promise that resolves or rejects
   * with a listId object or a DB Error.
   * @memberof TaskServices
   */
  static async deleteAnItem(id) {
    return db.none(deleteItem, [id]);
  }

  /**
   * @static
   * @param {number} id
   * @returns  { Promise<Object | Error> } A promise that resolves or rejects
   * with a listId object or a DB Error.
   * @memberof TaskServices
   */
  static async updateStatusById(id) {
    const status = 'completed';
    return db.oneOrNone(updateStatus, [status, id]);
  }

  static async updateStatusByIdToPending(id) {
    const status = 'pending';
    return db.oneOrNone(updateStatus, [status, id]);
  }

  static async searchItemByTitle(list) {
    return db.manyOrNone(searchItem, [list]);
  }

  static async getbucketList(id) {
    return db.manyOrNone(getTask, [id]);
  }
}

export default TaskServices;
