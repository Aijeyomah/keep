/* eslint-disable valid-jsdoc */
import authQueries from '../../db/queries/users';
import db from '../../db';

const { fetchUserByEmail } = authQueries;
/**
 *
 *
 * @class userServices
 */
class userServices {
  /**
   * @static
   * @param {email_address} email_address - user's email
   * @returns {Promise< Object | Error | Null > } -A promise that resolves or rejects
   * with a user or a DB Error.
   * @memberof userServices
   */
  static async getUserByEmail(email_address) {
    return db.oneOrNone(fetchUserByEmail, [email_address]);
  }
}
export default userServices;
