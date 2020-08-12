import queries from '../../db/queries/task';
import db from '../../db';
import { serverError } from '../../utils/messages';

const { getTask, createNotification } = queries;
/**
 * a job created that checks the db at intervals to check for task deadline
 * @class Notification
 */
class Notification {
  // eslint-disable-next-line require-jsdoc
  static async getDueTask(user_id) {
    return db.manyOrNone(getTask, [user_id]);
  }

  /**
   * a method checkes the the database at intervals for task that exceeded the due date
   * @static
   * @param {number} id
   * @returns { Promise<Array | Error> } - returns an array of tasks that exceeds the due date
   * @memberof TaskServices
   */
  static async NofifyDueTask() {
    return setInterval(Notification.saveNotification(), 2000);
  }

  /**
   *
   *
   * @static
   * @returns { Promise<Array<Object>> } An array of objects the content in the notification table
   * @memberof Notification
   */
  static async saveNotification() {
    try {
      const data = await Notification.getDueTask();
      const seen_by_user = 'no';
      if (data) {
        const notification = data.map((task) => db.oneOrNone(createNotification, [
          task.user_id,
          seen_by_user,
          task.id,
        ]));
        return Promise.all(notification);
      }

      return true;
    } catch (error) {
      serverError(error.message);
    }
  }
}

export default Notification;
