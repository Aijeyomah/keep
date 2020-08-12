import db from '../db';
import queries from '../db/queries/task';

/**
 *
 *
 * @class taskModel
 */
class TaskModel {
  /**
   *Creates an instance of taskModel.
   * @param {object} options - contains the require properties for creating a task instance
   * @returns  {TaskModel} - return an instance of a userModel
   *
   */
  constructor(options) {
    this.list_id = options.listId;
    this.task = options.task;
    this.due_date = options.dueDate;
    this.status = 'pending';
  }

  /**
   *  saves a title to the DB
   * @returns { Promise<Object | Error> } A promise that resolves or rejects
   * with a title object or a DB Error.
   * @memberof taskModel
   */
  async save() {
    try {
      return db.one(queries.createItems, [
        this.list_id,
        this.task,
        this.status,
        this.due_date,
      ]);
    } catch (error) {
      console.log(error);
    }
  }
}

export default TaskModel;
